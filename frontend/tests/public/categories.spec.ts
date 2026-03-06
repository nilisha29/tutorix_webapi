import { expect, test } from "@playwright/test";

test("categories page renders heading", async ({ page }) => {
  await page.goto("/categories");

  await expect(page.getByRole("heading", { name: /^categories$/i })).toBeVisible();
  await expect(
    page.getByText(/choose a subject to explore tutors/i)
  ).toBeVisible();
});
