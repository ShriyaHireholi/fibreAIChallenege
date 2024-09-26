import * as fs from "fs";
import * as csv from "fast-csv";

// Define an interface for a Company object
interface Company {
  name: string;
  url: string;
}

// Code referenced from fast-csv docs
// Function to parse a CSV file and return an array of Company objects
export const parseCSV = async (filePath: string): Promise<Company[]> => {
  const companies: Company[] = [];
  return new Promise((resolve, reject) => {
    // Create a read stream for the CSV file
    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      // Handle each row of data in the CSV file
      .on("data", (row) => {
        companies.push({
          name: row["Company Name"],
          url: row["YC URL"],
        });
      })
      .on("end", () => resolve(companies))
      .on("error", reject);
  });
};
