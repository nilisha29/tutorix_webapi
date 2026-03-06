import { expect, test } from "@playwright/test";

test("register page shows register heading and form fields", async ({ page }) => {
  await page.goto("/register");

  await expect(
    page.getByRole("heading", { name: /create your tutorix account/i })
  ).toBeVisible();
  await expect(page.getByPlaceholder(/e-mail|email/i)).toBeVisible();
  await expect(page.getByPlaceholder(/^Password$/i)).toBeVisible();
});
