import { expect, test } from "@playwright/test";

test("esewa success route redirects to payment-success", async ({ page }) => {
  await page.goto("/esewa/success?bookingId=b1&paymentRef=ref-1");

  await expect(page).toHaveURL(/\/payment-success\?/i);
  await expect(page).toHaveURL(/provider=esewa/i);
  await expect(page).toHaveURL(/status=success/i);
});

test("esewa failure route redirects to payment result cancelled", async ({ page }) => {
  await page.goto("/esewa/failure?bookingId=b1&paymentRef=ref-1");

  await expect(page).toHaveURL(/\/payment\/result\?/i);
  await expect(page).toHaveURL(/provider=esewa/i);
  await expect(page).toHaveURL(/status=cancelled/i);
});
