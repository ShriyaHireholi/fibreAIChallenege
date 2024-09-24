import { fileURLToPath } from 'url';
import path, { dirname } from "path";
import { parseCSV } from "./helperFunctions/parseCSV"; 


const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * The entry point function. This will read the provided CSV file, scrape the companies'
 * YC pages, and output structured data in a JSON file.
 */
export async function processCompanyList() {
  // parsing the csv file
  const filePath = path.join(__dirname, 'inputs/companies.csv')
  const companies = await parseCSV(filePath);
  console.log("COMPANIES: ", companies);

}
