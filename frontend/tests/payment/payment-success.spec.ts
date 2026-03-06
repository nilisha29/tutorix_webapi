import { expect, test } from "@playwright/test";

test("payment success page shows missing reference message without callback params", async ({ page }) => {
  await page.goto("/payment-success");

  await expect(page.getByRole("heading", { name: /payment success/i })).toBeVisible();
  await expect(
    page.getByText(/payment reference is missing for verification/i)
  ).toBeVisible();
});
