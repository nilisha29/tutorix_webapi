import { expect, test } from "@playwright/test";

test("admin page redirects unauthenticated user to login", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/login$/);
});

test("tutor dashboard redirects unauthenticated user to login", async ({ page }) => {
  await page.goto("/tutor/dashboard");

  await expect(page).toHaveURL(/\/login$/);
});
