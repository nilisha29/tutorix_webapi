import { expect, test } from "@playwright/test";

test("payment checkout asks unauthenticated user to login when paying", async ({ page }) => {
  await page.goto(
    "/payment/checkout?tutorId=t1&tutorName=John%20Tutor&date=2026-03-06&time=10:00&duration=60%20min&paymentMethod=esewa&amount=1500"
  );

  await page.getByRole("button", { name: /pay via esewa/i }).click();

  await expect(page).toHaveURL(/\/login$/);
});
