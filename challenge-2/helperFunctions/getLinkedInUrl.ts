export const getLinkedInUrl = async (page: any, name: string) => {
  try {
    // Extract LinkedIn URL
    return await page
      .locator('div.space-x-2 a[title="LinkedIn profile"]:nth-of-type(1)')
      .getAttribute("href");
  } catch (error) {
    console.warn(`LinkedIn URL not found for ${name}.`);
    return null;
  }
};
