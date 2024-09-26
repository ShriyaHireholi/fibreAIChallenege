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

  // Processing companies in chunks to reduce memory usage as my systems kept hanging up.
  const chunkSize = 10;

  // Uncomment this line to test with all the companies
  // const chunkSize = companies.length - 1;

  const chunks = [];
  for (let i = 0; i < companies.length; i += chunkSize) {
    chunks.push(companies.slice(i, i + chunkSize));
  }

  const results = [];
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map(async (company) => {
        try {
          const result = await scrapeCompany(company.url); // Scrape data for each company
          return result; // If successful, return the result
        } catch (error) {
          console.error(`Failed to scrape ${company.url}:`, error); // Log the error
          return null; // Return null for failed scrapes
        }
      })
    );
    results.push(...chunkResults.filter(result => result !== null)); // Only keep successful results
  }
  
  await saveToJson(results, 'out/scraped.json');
}


/*
  References:
  1. https://c2fo.github.io/fast-csv/docs/introduction/example
*/