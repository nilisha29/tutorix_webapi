import { expect, test } from "@playwright/test";

test("contact page renders heading and email", async ({ page }) => {
  await page.goto("/contact");

  await expect(page.getByRole("heading", { name: /contact/i })).toBeVisible();
  await expect(page.getByText(/support@tutorix.com/i)).toBeVisible();
});
