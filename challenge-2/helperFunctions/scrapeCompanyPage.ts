import { PlaywrightCrawler } from "crawlee";
import { getFoundedYear } from "./getFoundedYear";
import { getTeamSize } from "./getTeamSize";
import { getLinkedInUrl } from "./getLinkedInUrl";
import { getCompanyLocation } from "./getCompanyLocation";
import { getCompanyWebsite } from "./getCompanyWebsite";
import { getFounders } from "./getFounders";
import { getJobsListed } from "./getJobsListed";
import { getLatestNews } from "./getLatestNews";
import { getLaunchPosts } from "./getLaunchPosts";

// Code referenced from ChatGPT and Crawlee documents
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
export const scrapeCompany = async (
  url: string
): Promise<ScrapedCompany | null> => {
  let result: ScrapedCompany | null = null;

  try {
    const crawler = new PlaywrightCrawler({
      // Define the requestHandler for PlaywrightCrawler
      async requestHandler({ page, request }) {
        const name = request.url.split("/").slice(-1)[0];
        const foundedText = await getFoundedYear(page, name);
        const teamSize = await getTeamSize(page, name);
        const locationText = await getCompanyLocation(page, name);
        const linkedInUrl = await getLinkedInUrl(page, name);
        const companyWebsite = await getCompanyWebsite(page, name);
        const latestNews = await getLatestNews(page, name);
        const jobs = await getJobsListed(page, name);
        const founders = await getFounders(page, name);
        const launchPosts = await getLaunchPosts(page, name);

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
      },
    });

    // Run the PlaywrightCrawler on the provided URL
    await crawler.run([url]);
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
  }

  // Return the result (or null if the scraping failed)
  return result;
};
