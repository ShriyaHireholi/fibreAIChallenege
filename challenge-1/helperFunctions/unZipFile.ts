import * as fs from 'fs';
import * as zlib from 'zlib';
import * as tar from 'tar';

export function unZipFile(zipFilePath: string, extractPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.createReadStream(zipFilePath)
      .pipe(zlib.createGunzip())
      .pipe(tar.extract({ cwd: extractPath }))
      .on('finish', () => {
        console.log(`File extracted to ${extractPath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error extracting file: ${err}`);
        reject(err);
      });
  });
}

// https://www.blackbox.ai/share/7697d19b-58d6-4209-a23f-47b7e613e192