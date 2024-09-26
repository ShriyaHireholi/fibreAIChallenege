export const getCompanyWebsite = async (page: any, name: string) => {
  try {
    // Extract company Website
    return await page
      .locator("div.flex.flex-col div.group a div.inline-block")
      .textContent();
  } catch (error) {
    console.warn(`Company website not found for ${name}.`);
    return null;
  }
};
