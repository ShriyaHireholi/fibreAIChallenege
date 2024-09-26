export const getFoundedYear = async (page: any, name: string) => {
  try {
    // Extract founded year
    const founded = await page
      .locator(
        "div.flex.flex-row.justify-between:nth-of-type(1) span:nth-of-type(2)"
      )
      .textContent();
    return founded?.trim() || null;
  } catch (error) {
    console.warn(`Founded year not found for ${name}.`);
    return null;
  }
};
