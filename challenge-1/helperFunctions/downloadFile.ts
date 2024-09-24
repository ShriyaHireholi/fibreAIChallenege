import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

/**
 * Function to download and unzip a file
 * @param downloadUrl - to download the folder from
 * @param folderPath - The local folder path where the file should be saved
 * @param fileName - The name to save the downloaded zip file as
 * @returns Promise<void> - A promise that resolves when the file is downloaded
 */
export async function downloadFile (
    downloadUrl: string,
    folderPath: string,
    fileName: string
): Promise<void> {

    try {
        // Checking if the folder exists. If not then creating the folder
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }

        // File path to download the folder
        const zipFilePath: string = path.join(folderPath, fileName);
        const file: fs.WriteStream = fs.createWriteStream(zipFilePath);

        // Downloading the zip file
        const request = https.get(downloadUrl, (response) => {
            response.pipe(file);
        });

        // Logging if there is an error encountered while downloading the file
        request.on('error', (error) => {
            console.log('Error encountered while downloading the Zip file: ', error)
        });

        await new Promise<void>((resolve, reject) => {
            file.on('finish', resolve)
            file.on('error', reject)
        })
        console.log('Zip file downloaded successfully to ' + zipFilePath);
    } catch (error) {
        console.error('Error while downloading the zip file', error);
    }
}
