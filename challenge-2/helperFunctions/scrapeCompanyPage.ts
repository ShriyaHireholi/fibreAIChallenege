import { PlaywrightCrawler } from 'crawlee';

// interface for the scraped data
interface ScrapedCompany {
  name: string;
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
export const scrapeCompany = async (url: string): Promise<ScrapedCompany | null> => {
  let result: ScrapedCompany | null = null;

  try {
    const crawler = new PlaywrightCrawler({
      // Define the requestHandler for PlaywrightCrawler
      async requestHandler({ page, request }) {
        const name = request.url.split('/').slice(-1)[0];

        // Using try-catch for each element to handle missing elements
        let foundedText: string | null = null;
        let teamSize: number | null = null;
        let locationText: string | null = null;
        let linkedInUrl: string | null = null;
        let companyWebsite: string | null = null;
        let latestNews: LatestNews[] = [];
        let jobs: Job[] = [];
        let founders: Founder[] = [];
        let launchPosts: LaunchPost[] = [];

        try {
          // Extract founded year
          const founded = await page.locator('div.flex.flex-row.justify-between:nth-of-type(1) span:nth-of-type(2)').textContent();
          foundedText = founded?.trim() || null;
        } catch (error) {
          console.warn(`Founded year not found for ${name}.`);
        }

        try {
          // Extract team size
          const teamSizeText = await page.locator('div.flex.flex-row.justify-between:nth-of-type(2) span:nth-of-type(2)').textContent();
          teamSize = teamSizeText ? parseInt(teamSizeText.trim(), 10) : null;
        } catch (error) {
          console.warn(`Team size not found for ${name}.`);
        }

        try {
          // Extract location
          const location = await page.locator('div.flex.flex-row.justify-between:nth-of-type(3) span:nth-of-type(2)').textContent();
          locationText = location?.trim() || null;
        } catch (error) {
          console.warn(`Location not found for ${name}.`);
        }

        try {
          // Extract LinkedIn URL
          linkedInUrl = await page.locator('div.space-x-2 a[title="LinkedIn profile"]:nth-of-type(1)').getAttribute('href');
        } catch (error) {
          console.warn(`LinkedIn URL not found for ${name}.`);
        }

        try {
          // Extract company Website
          companyWebsite = await page.locator('div.flex.flex-col div.group a div.inline-block').textContent();
        } catch (error) {
          console.warn(`Company website not found for ${name}.`);
        }

        try {
          // Extract Latest News
          latestNews = await page
            .locator("#news > div > div")
            .evaluateAll((newsElements) => {
              if (newsElements.length === 0) {
                return []; // Return an empty array if no news items are found
              }

              return newsElements.map((newsElement) => {
                const titleElement = newsElement.querySelector(
                  "a.prose.font-medium"
                ); // Extract the title from the anchor tag
                const dateElement = newsElement.querySelector(".mb-4.text-sm"); // Extract the date from the specified class

                const title = titleElement
                  ? titleElement.textContent?.trim() || "Unknown title"
                  : "Unknown title";
                const date = dateElement
                  ? dateElement.textContent?.trim() || "Unknown date"
                  : "Unknown date";

                return { title, date };
              });
            });
        } catch (error) {
          console.warn("Error while fetching Latest News");
        }

        
      
        try{
          // Extract Jobs
          jobs = await page
            .locator(
              "section.relative div.flex.w-full.flex-col.justify-between.divide-y > div"
            )
            .evaluateAll((jobElements) => {
              if (jobElements.length === 0) {
                return []; // Return an empty array if no job elements are found
              }

              return jobElements.map((jobElement) => {
                const roleElement = jobElement.querySelector("a"); // Extract the role from the anchor tag
                const locationElement =
                  jobElement.querySelectorAll("div.list-item")[0]; // Extract the location

                const role = roleElement
                  ? roleElement.textContent?.trim() || "Unknown role"
                  : "Unknown role";
                const location = locationElement
                  ? locationElement.textContent?.trim() || "Unknown location"
                  : "Unknown location";

                return { role, location }; // Return an object for each job
              });
            });
        } catch (error) {
          console.warn('Error while fetching Jobs')
        }
      
          

        try {
          // Extract Founders
            founders = await page
              .locator("div.flex.flex-row.items-center.gap-x-3")
              .evaluateAll((founderElements) => {
                return founderElements.map((founderElement) => {
                  const nameElement =
                    founderElement.querySelector(".font-bold"); // Get the name element
                  const linkElement = founderElement.querySelector(
                    'a[title="LinkedIn profile"]'
                  ); // Get the LinkedIn link

                  const name = nameElement
                    ? nameElement.textContent?.trim() || "Unknown Name"
                    : "Unknown Name";
                  const linkedInUrl = linkElement
                    ? linkElement.getAttribute("href") || "Unknown URL"
                    : "Unknown URL";

                  return { name, linkedIn: linkedInUrl }; // Return an object with name and LinkedIn URL
                });
              });
        } catch (error) {
          console.warn('Error while fetching Founders')
        }
      
        try {
          // Extract Launch Posts
          launchPosts = await page
            .locator("div.prose.max-w-full.prose-h2\\:mt-0 a")
            .evaluateAll((launchElements) => {
              if (launchElements.length === 0) {
                return []; // Return an empty array if no launch posts are found
              }
              return launchElements.map((launchElement) => {
                const titleElement = launchElement.querySelector("h3"); // Get the title element
                const title = titleElement
                  ? titleElement.textContent?.trim() || "Unknown Title"
                  : "Unknown Title"; // Extract the text content

                return { title }; // Return an object with the title
              });
            });
        } catch (error) {
          console.warn('Error while fetching launch posts')
        }
      
      


        // Log the results for verification
        console.log(`Scraped ${name}: Founded: ${foundedText}, Team Size: ${teamSize}`);

        // Create the result object
        result = {
          name,
          founded: foundedText,
          teamSize,
          location: locationText,
          linkedInUrl,
          companyWebsite,
          latestNews: latestNews,
          jobs: jobs,
          founders: founders,
          launchPosts: launchPosts,
        };
      }
    });

    // Run the PlaywrightCrawler on the provided URL
    await crawler.run([url]);

  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
  }

  // Return the result (or null if the scraping failed)
  return result;
};
