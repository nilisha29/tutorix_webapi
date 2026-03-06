import { expect, test } from "@playwright/test";

test("home page has login entrypoint link", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /login/i }).first()).toBeVisible();
});

test("contact page navigation keeps public layout stable", async ({ page }) => {
  await page.goto("/contact");

  await expect(page.getByRole("heading", { name: /contact/i })).toBeVisible();
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: /about tutorix/i })).toBeVisible();
});
