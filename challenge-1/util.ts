import { fileURLToPath } from 'url';
import * as path from 'path';

/**
 * Function to get __dirname in ES modules
 * @param importMetaUrl - Pass in import.meta.url
 * @returns string - The directory name of the current file
 */
export const getDirname = (importMetaUrl: string): string => {
  const __filename = fileURLToPath(importMetaUrl);
  return path.dirname(__filename);
};
