import { expect, test } from "@playwright/test";

test("home page renders core content", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText(/how tutorix works/i)).toBeVisible();
  await expect(page.getByText(/top rated tutors/i)).toBeVisible();
});
