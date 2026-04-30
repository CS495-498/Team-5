/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
 * This file implements the /api/obvius route. This route accepts data from
 * Obvius meters, handling parameters passed in form/multipart, GET parameters,
 * or POST body parameters.
 *
 * STATUS mode requests are logged.
 *
 * CONFIGFILEMANIFEST requests are responded to with a dummy manifest which specifies
 * 					  a lack of config files to respond with.
 */

const express = require('express');
const config = require('../config');
const multer = require('multer');
const moment = require('moment');
const md5 = require('md5');
const zlib = require('zlib');
const { log } = require('../log');
const Configfile = require('../models/obvius/Configfile');
const listConfigfiles = require('../services/obvius/listConfigfiles');
const loadLogfileToReadings = require('../services/obvius/loadLogfileToReadings');
const middleware = require('../middleware');
const obvius = require('../util').obvius;
const { obviusUsernameAndPasswordAuthMiddleware } = require('./authenticator');
const { getConnection } = require('../db');
const escapeHtml = require('escape-html');
const { sanitizeForLog } = require('../util/sanitizeForLog');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.use(upload.any(), middleware.lowercaseAllParamNames);
router.use(middleware.paramsLookupMixin);

function getClientIp(req) {
	const rawIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
	return sanitizeForLog(rawIp);
}

/**
 * Inform the client of a failure (406 Not Acceptable), and log it.
 *
 * @param {express.Request} req The Express request object
 * @param {express.Response} res The Express response object
 * @param {string} reason The reason for the failure.
 *
 */
function failure(req, res, reason = '') {
	const ip = getClientIp(req);

	log.error('Obvius protocol request failed', {
		ip,
		reason: sanitizeForLog(reason)
	});

	res.status(406)
		.send(`<pre>\n${escapeHtml(reason)}\n</pre>\n`);
}

/**
 * Inform the client of a success (200 OK).
 *
 * @param {express.Request} req The Express request object
 * @param {express.Response} res The Express response object
 * @param {string} comment Any additional data to be returned to the client.
 *
 */
function success(req, res, comment = '') {
	res.status(200)
		.send(`<pre>\nSUCCESS\n${escapeHtml(comment)}</pre>\n`);
}

/**
 * Logs a STATUS request for later examination.
 * @param {express.Request} req the request to process (must have the req.param mixin)
 * @param {express.Response} res the response object
 */
function handleStatus(req, res) {
	const ip = getClientIp(req);

	const paramNames = [
		'MODE', 'SENDDATATRACE', 'SERIALNUMBER', 'GSMSIGNAL',
		'LOOPNAME', 'UPTIME', 'PERCENTBLOCKSINUSE', 'PERCENTINODESINUSE',
		'UPLOADATTEMPT', 'ACQUISUITEVERSION', 'USRVERSION', 'ROOTVERSION',
		'KERNELVERSION', 'FIRMWAREVERSION', 'BOOTCOUNT', 'BATTERYGOOD'
	];

	const loggedParams = {};

	for (const paramName of paramNames) {
		const value = req.param(paramName);
		if (value !== false && value !== undefined) {
			loggedParams[paramName] = sanitizeForLog(value);
		}
	}

	log.info('Handling Obvius STATUS request', {
		ip,
		params: loggedParams
	});

	success(req, res);
}

/**
 * Logs the Obvius request and sets the req.IP field to be the ip address.
 */
function obviusLog(req, res, next) {
	const ip = getClientIp(req);
	req.IP = ip;

	log.info('Received Obvius protocol request', { ip });
	next();
}

/**
 * Verifies an Obvius request via username and password.
 */
function verifyObviusUser(req, res, next) {
	const password = req.param('password');
	const username = req.param('username') || req.param('email');

	if (!password) {
		failure(req, res, 'password parameter is required.');
		return;
	} else if (!username) {
		failure(req, res, 'username parameter is required.');
		return;
	} else {
		req.body.username = username;
		req.body.password = password;
		obviusUsernameAndPasswordAuthMiddleware('Obvius pipeline')(req, res, next);
	}
}

/**
 * Handle an Obvius upload request.
 * Unfortunately the Obvious API does not specify a HTTP verb.
 */
router.all('/', obviusLog, verifyObviusUser, async (req, res) => {
	const ip = req.IP;

	const mode = req.param('mode', false);
	if (mode === false) {
		failure(req, res, 'Request must include mode parameter.');
		return;
	}

	if (mode === obvius.mode.status) {
		handleStatus(req, res);
		return;
	}

	if (mode === obvius.mode.logfile_upload) {
		if (!req.param('serialnumber', false)) {
			failure(req, res, 'Logfile Upload Requires Serial Number');
			return;
		}

		const conn = getConnection();
		const loadLogfilePromises = [];

		for (const fx of req.files) {
			log.info('Received logfile upload', {
				ip,
				field: sanitizeForLog(fx.fieldname),
				filename: sanitizeForLog(fx.originalname)
			});

			let data;
			try {
				data = zlib.gunzipSync(fx.buffer);
			} catch (err) {
				log.error('Unable to gunzip incoming buffer', {
					ip,
					error: sanitizeForLog(err.message)
				});
				failure(req, res, 'Unable to gunzip incoming buffer');
				return;
			}

			loadLogfilePromises.push(
				loadLogfileToReadings(
					sanitizeForLog(req.param('serialnumber')),
					ip,
					data,
					conn
				)
			);
		}

		try {
			await Promise.all(loadLogfilePromises);
			success(req, res, 'Logfile Upload IS PROVISIONAL');
		} catch (err) {
			log.warn('Logfile Upload had issues', {
				ip,
				error: sanitizeForLog(err.message)
			});
			failure(req, res, 'Logfile Upload had issues');
		}
		return;
	}

	if (mode === obvius.mode.config_file_manifest) {
		const conn = getConnection();
		success(req, res, await listConfigfiles(conn));
		return;
	}

	if (mode === obvius.mode.config_file_upload) {
		if (!req.param('serialnumber', false)) {
			failure(req, res, 'Config Upload Requires Serial Number');
			return;
		}
		if (!req.param('modbusdevice', false)) {
			failure(req, res, 'Config Upload Requires Modbus Device ID');
			return;
		}

		const conn = getConnection();

		for (const fx of req.files) {
			log.info('Received config file upload', {
				ip,
				field: sanitizeForLog(fx.fieldname),
				filename: sanitizeForLog(fx.originalname)
			});

			let data;
			try {
				data = zlib.gunzipSync(fx.buffer).toString('utf-8');
			} catch {
				data = fx.buffer.toString('utf-8');
			}

			const cf = new Configfile(
				undefined,
				sanitizeForLog(req.param('serialnumber')),
				sanitizeForLog(req.param('modbusdevice')),
				moment(),
				md5(data),
				data,
				true
			);

			await cf.insert(conn);
			success(req, res, `Acquired config log with filename ${cf.makeFilename()}.`);
		}
		return;
	}

	failure(req, res, `Unknown mode '${mode}'`);
});

module.exports = router;
