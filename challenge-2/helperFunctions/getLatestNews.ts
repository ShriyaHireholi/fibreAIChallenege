export const getLatestNews = async (page: any, name: string) => {
  try {
    // Extract Latest News
    return await page
      .locator("#news > div > div")
      .evaluateAll((newsElements: HTMLElement[]) => {
        if (newsElements.length === 0) {
          return []; // Return an empty array if no news items are found
        }

        return newsElements.map((newsElement) => {
          const titleElement = newsElement.querySelector("a.prose.font-medium"); // Extract the title from the anchor tag
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
    console.warn(`Error while fetching Latest News for ${name}.`);
    return [];
  }
};
