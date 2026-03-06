import { expect, test } from "@playwright/test";

test("about page renders heading", async ({ page }) => {
  await page.goto("/about");

  await expect(page.getByRole("heading", { name: /about tutorix/i })).toBeVisible();
});
