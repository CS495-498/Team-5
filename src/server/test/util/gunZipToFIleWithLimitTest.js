
const { mocha, expect } = require('../common');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const gunzipToFileWithLimit = require('../../util/gunzipToFileWithLimit');

mocha.describe('gunzipToFileWithLimit', () => {
  const tmpDir = path.join(os.tmpdir(), 'oed-gunzip-test');
  const outDir = path.join(tmpDir, 'out');
  const bombGz = path.join(tmpDir, 'bomb.gz');

  mocha.before(async () => {
    await fsp.mkdir(tmpDir, { recursive: true });
    // Create gz that expands beyond 50 MB
    execSync(`head -c 67108864 /dev/zero | gzip > ${bombGz}`);
  });

  mocha.after(async () => {
    try { await fsp.rm(tmpDir, { recursive: true, force: true }); } catch (_) {}
  });

  mocha.it('rejects when decompressed size exceeds configured max bytes', async () => {
    let err;
    try {
      await gunzipToFileWithLimit(
        bombGz,
        outDir,
        'out.csv',
        50 * 1024 * 1024 // 50 MB
      );
    } catch (e) {
      err = e;
    }

    expect(err).to.exist;
    expect(err.message).to.equal(
      'Decompressed size exceeds limit (max 52428800 bytes)'
    );
  });
});
