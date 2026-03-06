import { expect, test } from "@playwright/test";

test("payment checkout renders eSewa details from query params", async ({ page }) => {
  await page.goto(
    "/payment/checkout?tutorId=t1&tutorName=John%20Tutor&date=2026-03-06&time=10:00&duration=60%20min&paymentMethod=esewa&amount=1500"
  );

  await expect(page.getByRole("heading", { name: /esewa checkout/i })).toBeVisible();
  await expect(page.getByText(/john tutor/i)).toBeVisible();
  await expect(page.getByText(/npr 1500.00/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /pay via esewa/i })).toBeVisible();
});

test("payment checkout cancel goes to payment result cancelled", async ({ page }) => {
  await page.goto(
    "/payment/checkout?tutorId=t1&tutorName=John%20Tutor&date=2026-03-06&time=10:00&duration=60%20min&paymentMethod=esewa&amount=1500"
  );

  await page.getByRole("button", { name: /^cancel$/i }).click();

  await expect(page).toHaveURL(/\/payment\/result\?/i);
  await expect(page).toHaveURL(/provider=esewa/i);
  await expect(page).toHaveURL(/status=cancelled/i);
});

test("payment checkout renders Khalti heading when method is khalti", async ({ page }) => {
  await page.goto(
    "/payment/checkout?tutorId=t1&tutorName=John%20Tutor&date=2026-03-06&time=10:00&duration=60%20min&paymentMethod=khalti&amount=1500"
  );

  await expect(page.getByRole("heading", { name: /khalti checkout/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /pay via khalti/i })).toBeVisible();
});
