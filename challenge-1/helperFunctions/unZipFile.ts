import * as fs from 'fs';
import * as zlib from 'zlib';
import * as tar from 'tar';



// Code refactored and referenced using Blackbox.ai
/**
 * Unzip a file and extract its contents to a specified directory.
 * 
 * @param {string} zipFilePath - The path to the zip file to be unzipped.
 * @param {string} extractPath - The directory where the file should be extracted.
 * @returns {Promise<void>} - A promise that resolves when the extraction is complete.
 */
export function unZipFile(zipFilePath: string, extractPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create a read stream for the zip file
    fs.createReadStream(zipFilePath)
      // Pipe the stream to a gunzip stream to decompress the file
      .pipe(zlib.createGunzip())
      // Pipe the decompressed stream to a tar extract stream to extract the file contents
      .pipe(tar.extract({ cwd: extractPath }))
      .on('finish', () => {
        console.log(`File extracted to ${extractPath}`);
        // Resolve the promise when the extraction is complete
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error extracting file: ${err}`);
        // Reject the promise with the error if an error occurs
        reject(err);
      });
  });
}

// https://www.blackbox.ai/share/7697d19b-58d6-4209-a23f-47b7e613e192