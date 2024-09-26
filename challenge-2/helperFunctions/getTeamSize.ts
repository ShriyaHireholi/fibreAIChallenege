export const getTeamSize = async (page: any, name: string) => {
  try {
    // Extract team size
    const teamSizeText = await page
      .locator(
        "div.flex.flex-row.justify-between:nth-of-type(2) span:nth-of-type(2)"
      )
      .textContent();
    return teamSizeText ? parseInt(teamSizeText.trim(), 10) : null;
  } catch (error) {
    console.warn(`Team size not found for ${name}.`);
    return null;
  }
};
