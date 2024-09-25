import { PlaywrightCrawler } from 'crawlee';

// interface for the scraped data
interface ScrapedCompany {
  name: string | null;
  founded: string | null;
  teamSize: number | null;
  location: string | null;
  linkedInUrl: string | null;
  companyWebsite: string | null;
  latestNews: LatestNews[];
  jobs: Job[];
  founders: Founder[];
  launchPosts: LaunchPost[];
}

interface LatestNews {
  title: string;
  date: string;
}

interface Job {
  role: string;
  location: string;
}

interface Founder {
  name: string;
  linkedIn: string;
}

interface LaunchPost {
  title: string;
}

/**
 * Scrapes company data from the given URL using PlaywrightCrawler.
 */
export const scrapeCompany = async (url: string): Promise<ScrapedCompany> => {
  let result: ScrapedCompany | null = null;

  const crawler = new PlaywrightCrawler({
    // Define the requestHandler for PlaywrightCrawler
    async requestHandler({ page, request }) {
      const name = await page.locator('div.space-y-3 div.prose.max-w-full h1').textContent();

      // Extract founded year
      const founded = await page.locator('div.flex.flex-row.justify-between:nth-of-type(1) span:nth-of-type(2)').textContent();
      const foundedText = founded?.trim() || null;

      // Extract team size
      const teamSizeText = await page.locator('div.flex.flex-row.justify-between:nth-of-type(2) span:nth-of-type(2)').textContent();
      const teamSize = teamSizeText ? parseInt(teamSizeText.trim(), 10) : null;

      // Extract location
      const location = await page.locator('div.flex.flex-row.justify-between:nth-of-type(3) span:nth-of-type(2)').textContent();
      const locationText = location?.trim() || null;

      // Extract LinkedIn URL
      const linkedInUrl = await page.locator('div.space-x-2 a[title="LinkedIn profile"]').nth(0).getAttribute('href');

      // Extract company Website
      const companyWebsite = await page.locator('div.flex.flex-col div.group a div.inline-block').textContent();

      // Extract Latest News 
      const latestNews = await page.locator('#news > div > div').evaluateAll(newsElements => {
        if (newsElements.length === 0) {
          return [];  // Return an empty array if no news items are found
        }
        
        return newsElements.map(newsElement => {
          const titleElement = newsElement.querySelector('a.prose.font-medium'); // Extract the title from the anchor tag
          const dateElement = newsElement.querySelector('.mb-4.text-sm'); // Extract the date from the specified class
          
          const title = titleElement ? titleElement.textContent?.trim() : 'Unknown title';
          const date = dateElement ? dateElement.textContent?.trim() : 'Unknown date';
          
          return { title, date };
        });
      });

      // Extract Jobs
      const jobs = await page.locator('section.relative div.flex.w-full.flex-col.justify-between.divide-y > div').evaluateAll(jobElements => {
        if (jobElements.length === 0) {
          return [];  // Return an empty array if no jobs are found
        }  
        return jobElements.map(jobElement => {
          const roleElement = jobElement.querySelector('a'); // Extract the role from the anchor tag
          const locationElement = jobElement.querySelectorAll('div.list-item')[0]; // Extract the location, which is the first "list-item"
          
          const role = roleElement ? roleElement.textContent?.trim() : 'Unknown role';
          const location = locationElement ? locationElement.textContent?.trim() : 'Unknown location';
          
          return { role, location };
        });
      });

      // Extract Founders
      const founders = await page.locator('div.flex.flex-row.items-center.gap-x-3').evaluateAll(founderElements => {
        return founderElements.map(founderElement => {
          const nameElement = founderElement.querySelector('.font-bold'); // Get the name element
          const linkElement = founderElement.querySelector('a[title="LinkedIn profile"]'); // Get the LinkedIn link
  
          const name = nameElement ? nameElement.textContent?.trim() : 'Unknown Name';
          const linkedInUrl = linkElement ? linkElement.getAttribute('href') : 'Unknown URL';
  
          return { name, linkedIn: linkedInUrl }; // Return an object with name and LinkedIn URL
        });
      });
      
      // Extract Launch Posts
      const launchPosts = await page.locator('div.prose.max-w-full.prose-h2\\:mt-0 a').evaluateAll(launchElements => {
        if (launchElements.length === 0) {
          return [];  // Return an empty array if no launch posts are found
        }  
        return launchElements.map(launchElement => {
          const titleElement = launchElement.querySelector('h3'); // Get the title element
          const title = titleElement ? titleElement.textContent?.trim() : 'Unknown Title'; // Extract the text content
  
          return { title }; // Return an object with the title
        });
      });

      // Log the results for verification
      console.log(`Scraped ${name}: Founded: ${foundedText}, Team Size: ${teamSize}, Location: ${locationText}`);

      // Create the result object
      result = {
        name,
        founded: foundedText,
        teamSize,
        location: locationText,
        linkedInUrl,
        companyWebsite,
        latestNews,
        jobs,
        founders,
        launchPosts
      };
    }
  });

  // Run the PlaywrightCrawler on the provided URL
  await crawler.run([url]);

  // If the scraping result is still null, throw an error
  if (!result) {
    throw new Error(`Failed to scrape data from ${url}`);
  }

  // Return the final result
  return result;
};
