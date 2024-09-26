export const getLaunchPosts = async (page: any, name: string) => {
  try {
    // Extract Launch Posts
    return await page
      .locator("div.prose.max-w-full.prose-h2\\:mt-0 a")
      .evaluateAll((launchElements: HTMLElement[]) => {
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
    console.warn(`Error while fetching launch posts for ${name}`);
    return [];
  }
};
