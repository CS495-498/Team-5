/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


const zlib = require("zlib");
const fs = require("fs");
const fsp = require("fs").promises;
const path = require("path");

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024;   
// 10 MB
const ABSOLUTE_MAX_BYTES = 50 * 1024 * 1024; 
 // 50 MB hard cap


/**
  * Stream gunzip -> file, while enforcing a hard cap on decompressed output bytes.
  * Prevents gzip "zip bombs" from exhausting memory/disk.
  *
  * @param {string} inputPath
  * @param {string} outputDir
  * @param {string} outputFilename
  * @param {number} maxBytes
  * @returns {Promise<string>}
  */

async function gunzipToFileWithLimit(
    inputPath,
    outputDir,
    outputFilename,
    maxBytes = DEFAULT_MAX_BYTES
) {

    // outputDir is expected to be an existing, OED-controlled directory
    // created earlier in the upload pipeline (e.g., by multer)


	if (maxBytes > ABSOLUTE_MAX_BYTES) {
    throw new Error(
        `Requested maxBytes exceeds allowed maximum (${ABSOLUTE_MAX_BYTES} bytes)`
    );
	}

    const outPath = path.join(outputDir, outputFilename);

    return new Promise((resolve, reject) => {
        const source = fs.createReadStream(inputPath);
        const gunzip = zlib.createGunzip();
        const dest = fs.createWriteStream(outPath, { flags: "wx" });
        // Will fail if file already exists

        let total = 0;
        let cleanedUp = false;

        gunzip.on("data", (chunk) => {
            total += chunk.length;
            if (total > maxBytes) {
                const err = new Error(
                    `Decompressed size exceeds limit (max ${maxBytes} bytes)`
                );
                source.destroy();
                dest.destroy();
                gunzip.destroy(err);
            }
        });

        // Cleanup is event-driven; stream errors can occur asynchronously,
        // so this must be guarded to ensure it only runs once.
        const cleanup = async (err) => {
            if (cleanedUp) return;
            cleanedUp = true;

            try {
                await fsp.unlink(outPath);
            } catch (_) {
                // Ignore errors if the file does not exist
            }

            reject(err);
        };

        source.on("error", cleanup);
        gunzip.on("error", cleanup);
        dest.on("error", cleanup);

        dest.on("finish", () => resolve(outPath));

        source.pipe(gunzip).pipe(dest);
    });
}

module.exports = gunzipToFileWithLimit;