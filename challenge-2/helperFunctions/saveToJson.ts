import { writeFile } from "fs/promises";


// Code referenced from ChatGPT
/**
 * Saves the scraped data into a JSON file in the 'out/' folder.
 */
export const saveToJson = async (data: any, filePath: string) => {
  await writeFile(filePath, JSON.stringify(data, null, 2));
};
