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

interface CsvFile {
  tableName: string;
  filePath: string;
}

export async function processDataDump() {
  // Downloading the dump file and unzipping it
  const __dirname = getDirname(import.meta.url);
  const folderPath: string = path.join(__dirname, 'tmp');
  const zipFilePath: string = path.join(folderPath, 'tar.zip');
  
  // Downloading and Unzipping the file5rgdexs
  await downloadFile(DUMP_DOWNLOAD_URL, folderPath, 'tar.zip')
  await unZipFile(zipFilePath, folderPath);

  // Table Creation
  const csvFiles: CsvFile[] = [
    { tableName: 'customers', filePath: './tmp/dump/customers.csv' },
    { tableName: 'organizations', filePath: './tmp/dump/organizations.csv' },
  ];
  
  csvFiles.forEach((csvFile) => {
    createTableFromCsv(csvFile);
  });
}




/*
References:
1. https://medium.com/@me9lika.sh/uploading-and-downloading-large-files-with-nodejs-db9e1bf4a8cc
2. https://stackoverflow.com/questions/43048113/use-fs-in-typescript
*/