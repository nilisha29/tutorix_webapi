import { expect, test } from "@playwright/test";

test("reset password page validates missing token", async ({ page }) => {
  await page.goto("/reset-password");

  await page.getByPlaceholder(/new password/i).fill("Password123");
  await page.getByPlaceholder(/confirm password/i).fill("Password123");
  await page.getByRole("button", { name: /reset password/i }).click();

  await expect(page.getByText(/invalid reset link/i)).toBeVisible();
});

test("reset password page validates password mismatch", async ({ page }) => {
  await page.goto("/reset-password?token=fake-token");

  await page.getByPlaceholder(/new password/i).fill("Password123");
  await page.getByPlaceholder(/confirm password/i).fill("Password321");
  await page.getByRole("button", { name: /reset password/i }).click();

  await expect(page.getByText(/passwords do not match/i)).toBeVisible();
});
