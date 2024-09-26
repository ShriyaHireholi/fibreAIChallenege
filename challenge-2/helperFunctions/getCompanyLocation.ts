export const getCompanyLocation = async (page: any, name: string) => {
  try {
    // Extract location
    const location = await page
      .locator(
        "div.flex.flex-row.justify-between:nth-of-type(3) span:nth-of-type(2)"
      )
      .textContent();
    return location?.trim() || null;
  } catch (error) {
    console.warn(`Location not found for ${name}.`);
    return null;
  }
};
