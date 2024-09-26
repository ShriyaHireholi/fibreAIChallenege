import * as fs from 'fs';
import * as readline from 'readline';
import db from './databaseConnection';

interface CsvFile {
  tableName: string;
  filePath: string;
}

const createTableFromCsv = async (csvFile: CsvFile) => {
  try {

    // referenced from stack overflow
    // read the file
    const fileStream = fs.createReadStream(csvFile.filePath, 'utf8');
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let headers: string[] = [];
    let rows: any[] = [];
    let isFirstLine = true;

     // Referenced from blackbox.ai
    for await (const line of rl) {
      if (isFirstLine) {
        headers = line.split(',');
        isFirstLine = false;

        // Create the table dynamically based on the CSV file structure
        await db.schema.createTableIfNotExists(csvFile.tableName, (table: any) => {
          headers.forEach((header) => {
            table.string(header);
          });
        });
      } else {
        const columns = line.split(',');
        const row: any = {};

        headers.forEach((header, index) => {
          row[header] = columns[index];
        });

        rows.push(row);

        // Insert data in batches of 100 rows
        if (rows.length === 100) {
          await db(csvFile.tableName).insert(rows);
          rows = []; // Clear the batch
        }
      }
    }

    // Insert any remaining rows that didn't make up a full batch
    if (rows.length > 0) {
      await db(csvFile.tableName).insert(rows);
    }

    console.log(`Data inserted into ${csvFile.tableName}`);
    rl.close();
    fileStream.close();

  } catch (err) {
    console.error(err);
  }
};

export { createTableFromCsv };
