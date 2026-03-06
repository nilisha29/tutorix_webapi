import { expect, test } from "@playwright/test";

test("home page contains core navigation links", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /^all subjects$/i })).toHaveAttribute(
    "href",
    "/categories"
  );

  await expect(page.getByRole("link", { name: /see all/i })).toHaveAttribute(
    "href",
    "/tutors"
  );
});
