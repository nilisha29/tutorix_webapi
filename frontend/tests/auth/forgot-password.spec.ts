import { expect, test } from "@playwright/test";

test("forgot password page loads send reset action", async ({ page }) => {
  await page.goto("/forgot-password");

  await expect(page.getByRole("heading", { name: /forgot password/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /send reset link/i })).toBeVisible();
});

test("forgot password page validates empty email", async ({ page }) => {
  await page.goto("/forgot-password");

  await page.getByRole("button", { name: /send reset link/i }).click();

  await expect(page.getByText(/please enter your email/i)).toBeVisible();
});
