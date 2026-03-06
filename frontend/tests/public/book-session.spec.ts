import { expect, test } from "@playwright/test";

test("book session page renders heading and intro", async ({ page }) => {
  await page.goto("/book-session");

  await expect(page.getByRole("heading", { name: /book a session/i })).toBeVisible();
  await expect(
    page.getByText(/choose a tutor, pick a time, and confirm your session/i)
  ).toBeVisible();
});
