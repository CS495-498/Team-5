/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const { mocha, expect } = require('../common');
const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const gunzipToFileWithLimit = require('../../util/gunzipToFileWithLimit');

mocha.describe('gunzipToFileWithLimit', () => {
    const tmpDir = path.join(os.tmpdir(), 'oed-gunzip-test');
    const outDir = path.join(tmpDir, 'out');

    const smallTxt = path.join(tmpDir, 'small.txt');
    const smallGz = path.join(tmpDir, 'small.gz');
    const bombGz = path.join(tmpDir, 'bomb.gz');
    const corruptGz = path.join(tmpDir, 'corrupt.gz');

    mocha.before(async () => {
        await fsp.mkdir(outDir, { recursive: true });

        // Small, valid gzip (happy path)
        await fsp.writeFile(smallTxt, 'a,b,c\n1,2,3\n');
        execSync(`gzip -c ${smallTxt} > ${smallGz}`);

        // Gzip bomb (>50MB decompressed)
        execSync(`head -c 67108864 /dev/zero | gzip > ${bombGz}`);

        // Corrupt gzip (not actually gzipped)
        await fsp.writeFile(corruptGz, 'this is not a gzip file');
    });

    mocha.after(async () => {
        try {
            await fsp.rm(tmpDir, { recursive: true, force: true });
        } catch (_) {}
    });

     // Happy path: valid gzip under size limit
    
    mocha.it('successfully gunzips a valid file under the size limit', async () => {
        const outFile = 'valid.csv';

        const outPath = await gunzipToFileWithLimit(
            smallGz,
            outDir,
            outFile,
            1024 * 1024
        );

        const exists = fs.existsSync(outPath);
        const content = await fsp.readFile(outPath, 'utf8');

        expect(exists).to.equal(true);
        expect(content).to.equal('a,b,c\n1,2,3\n');
    });

  		//Rejects gzip bomb that exceeds decompressed size limit
  
    mocha.it('rejects when decompressed size exceeds configured max bytes', async () => {
        let err;
        const outFile = 'bomb.csv';
        const outPath = path.join(outDir, outFile);

        try {
            await gunzipToFileWithLimit(
                bombGz,
                outDir,
                outFile,
                50 * 1024 * 1024 // 50 MB
            );
        } catch (e) {
            err = e;
        }

        expect(err).to.exist;
        expect(err.message).to.match(/exceeds/i);
        expect(fs.existsSync(outPath)).to.equal(false);
    });

  		//Ensures partial output file is cleaned up on failure
     
    mocha.it('removes partially written output file when size limit is exceeded', async () => {
        const outFile = 'partial.csv';
        const outPath = path.join(outDir, outFile);

        try {
            await gunzipToFileWithLimit(
                bombGz,
                outDir,
                outFile,
                10 * 1024 // very small limit
            );
        } catch (_) {
            // expected
        }

        expect(fs.existsSync(outPath)).to.equal(false);
    });

    
			//Existing output file must not be overwritten
     
    mocha.it('fails if output file already exists and does not overwrite it', async () => {
        const outFile = 'existing.csv';
        const outPath = path.join(outDir, outFile);

        await fsp.writeFile(outPath, 'original data');

        let err;
        try {
            await gunzipToFileWithLimit(
                smallGz,
                outDir,
                outFile,
                1024 * 1024
            );
        } catch (e) {
            err = e;
        }

        const content = await fsp.readFile(outPath, 'utf8');

        expect(err).to.exist;
        expect(content).to.equal('original data');
    });

    
    //Corrupt gzip input fails safely
    
    mocha.it('rejects corrupt or invalid gzip input', async () => {
        const outFile = 'corrupt.csv';
        let err;

        try {
            await gunzipToFileWithLimit(
                corruptGz,
                outDir,
                outFile,
                1024 * 1024
            );
        } catch (e) {
            err = e;
        }

        expect(err).to.exist;
        expect(fs.existsSync(path.join(outDir, outFile))).to.equal(false);
    });
		
    });