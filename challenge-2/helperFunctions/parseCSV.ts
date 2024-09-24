import * as fs from 'fs';
import * as csv from 'fast-csv';

interface Company {
  name: string;
  url: string;
}

export const parseCSV = async (filePath: string): Promise<Company[]> => {
    const companies: Company[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('data', (row) => {
          companies.push({
            name: row['Company Name'],
            url: row['YC URL'],
          });
        })
        .on('end', () => resolve(companies))
        .on('error', reject);
    });
  };
  
