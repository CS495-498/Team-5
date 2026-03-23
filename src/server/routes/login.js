/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretToken = require('../config').secretToken;
const validate = require('jsonschema').validate;
const classLogger = require('../../../logger');
const { log } = require('../log');
const { getConnection } = require('../db');
const { credentialsRequestValidationMiddleware } = require('./authenticator');

const router = express.Router();

/**
 * Authenticate users and return a JSON Web Token with their user ID.
 * @param {String} username
 * @param {String} Password
 */
router.post('/', credentialsRequestValidationMiddleware, async (req, res) => {
	const validParams = {
		type: 'object',
		maxProperties: 2,
		required: ['username', 'password'],
		properties: {
			username: {
				type: 'string',
				minLength: 3,
				maxLength: 254
			},
			password: {
				type: 'string',
				minLength: 8,
				maxLength: 128
			}
		}
	};

	if (!validate(req.body, validParams).valid) {
		classLogger.warn(
			`auth.login.validation_failed | requestId=${req.requestId} route=${req.originalUrl} statusCode=400 username=${req.body?.username || "unknown"} ip=${req.ip}`
		  );
		res.sendStatus(400);
	} else {
		const conn = getConnection();
		try {
			const user = await User.getByUsername(req.body.username, conn);
			let isValid;
			if (user === null) {
				// User did not exist so return false.
				await bcrypt.compare(req.body.password, user.passwordHash);
				isValid = false;
				classLogger.warn(
					`auth.login.user_not_found | requestId=${req.requestId} route=${req.originalUrl} statusCode=401 username=${req.body?.username || "unknown"} ip=${req.ip}`
				  );
			} else {
				isValid = await bcrypt.compare(req.body.password, user.passwordHash);
			}
			if (isValid) {
				const token = jwt.sign({ data: user.id }, secretToken, { expiresIn: 86400 });
				classLogger.info({
					event: "auth.login.success",
					message: "successful login",
					statusCode: "200"
				});
				res.json({ token: token, username: user.username, role: user.role });
			} else {
				throw new Error('Unauthorized password');
			}
		} catch (err) {
			if (err.message === 'Unauthorized password' || err.message === 'No data returned from the query.') {
				classLogger.warn(
					`auth.login.failed | requestId=${req.requestId} route=${req.originalUrl} statusCode=401 username=${req.body?.username || "unknown"} ip=${req.ip}`
				  );
				res.status(401).send({ text: 'Not authorized' });
			} else {
				classLogger.error(
					`auth.login.error | requestId=${req.requestId} route=${req.originalUrl} statusCode=500 username=${req.body?.username || "unknown"} ip=${req.ip}`
				  );
				log.error(`Unable to check user password for ${req.body.username}`, err);
				res.status(500).send({ text: 'Internal Server Error' });
			}
		}
	}
});

module.exports = router;