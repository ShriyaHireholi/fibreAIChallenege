export const getFounders = async (page: any, name: string) => {
  try {
    // Extract Founders
    return await page
      .locator("div.flex.flex-row.items-center.gap-x-3")
      .evaluateAll((founderElements) => {
        return founderElements.map((founderElement) => {
          const nameElement = founderElement.querySelector(".font-bold"); // Get the name element
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
    console.warn(`Error while fetching Founders for ${name}`);
    return [];
  }
};
