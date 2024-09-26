export const getJobsListed = async (page: any, name: string) => {
  try {
    // Extract Jobs
    return await page
      .locator(
        "section.relative div.flex.w-full.flex-col.justify-between.divide-y > div"
      )
      .evaluateAll((jobElements: HTMLElement[]) => {
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
    console.warn(`Error while fetching Jobs for ${name}`);
    return [];
  }
};
