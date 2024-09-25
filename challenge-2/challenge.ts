import { fileURLToPath } from 'url';
import path, { dirname } from "path";
import { parseCSV } from "./helperFunctions/parseCSV"; 
import { scrapeCompany } from './helperFunctions/scrapeCompanyPage';
import { saveToJson } from './helperFunctions/saveToJson';


const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * The entry point function. This will read the provided CSV file, scrape the companies'
 * YC pages, and output structured data in a JSON file.
 */
export async function processCompanyList() {
  // parsing the csv file
  const filePath = path.join(__dirname, 'inputs/companies.csv')
  const companies = await parseCSV(filePath);
  const scrapedData = await Promise.all(
    companies.map((company) => scrapeCompany(company.url)) // Scrape data for each company
  );

  await saveToJson(scrapedData, 'out/scraped.json');

}
