import { expect, test } from "@playwright/test";

test("tutors page renders heading and search input", async ({ page }) => {
  await page.goto("/tutors");

  await expect(page.getByRole("heading", { name: /explore tutors/i })).toBeVisible();
  await expect(
    page.getByPlaceholder(/search tutors by name, subject/i)
  ).toBeVisible();
});
