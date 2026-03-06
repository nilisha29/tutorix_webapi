import { expect, test } from "@playwright/test";

test("payment result page shows missing reference message when params are absent", async ({ page }) => {
  await page.goto("/payment/result");

  await expect(page.getByRole("heading", { name: /payment result/i })).toBeVisible();
  await expect(
    page.getByText(/payment reference is missing for verification/i)
  ).toBeVisible();
});
