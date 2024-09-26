/**
 * The entry point function. This will download the given dump file, extract/decompress it,
 * parse the CSVs within, and add the data to a SQLite database.
 * This is the core function you'll need to edit, though you're encouraged to make helper
 * functions!
 */
import * as path from 'path';
import { DUMP_DOWNLOAD_URL } from './resources'
import { getDirname } from './util';
import { downloadFile } from './helperFunctions/downloadFile';
import { unZipFile } from './helperFunctions/unZipFile';
import { createTableFromCsv } from './helperFunctions/databseCreation'

// interface of Csv file to read the data from
interface CsvFile {
  tableName: string;
  filePath: string;
}

export async function processDataDump() {
  const __dirname = getDirname(import.meta.url);

  // Downloading the dump file and unzipping it
  const folderPath: string = path.join(__dirname, 'tmp');
  const zipFilePath: string = path.join(folderPath, 'tar.zip');

  await downloadFile(DUMP_DOWNLOAD_URL, folderPath, zipFilePath)
  await unZipFile(zipFilePath, folderPath);

  // Table Creation
  const csvFiles: CsvFile[] = [
    { tableName: 'customers', filePath: './tmp/dump/customers.csv' },
    { tableName: 'organizations', filePath: './tmp/dump/organizations.csv' },
  ];

  await Promise.all(csvFiles.map((csvFile) => createTableFromCsv(csvFile)));
}

/*
References:
1. https://medium.com/@me9lika.sh/uploading-and-downloading-large-files-with-nodejs-db9e1bf4a8cc
2. https://stackoverflow.com/questions/43048113/use-fs-in-typescript
3. https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
*/