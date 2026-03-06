import { expect, test } from "@playwright/test";

test("login page shows sign-in heading", async ({ page }) => {
  await page.goto("/login");

  await expect(
    page.getByRole("heading", { name: /sign in to your tutorix account/i })
  ).toBeVisible();
  await expect(page.getByPlaceholder(/e-mail|email/i)).toBeVisible();
  await expect(page.getByPlaceholder(/password/i)).toBeVisible();
});

test("login page shows validation messages for invalid submit", async ({ page }) => {
  await page.goto("/login");

  await page.getByRole("button", { name: /sign-in/i }).click();

  await expect(page.getByText(/enter a valid email/i)).toBeVisible();
  await expect(
    page.getByText(/password must be at least 6 characters/i)
  ).toBeVisible();
});

test("login page links navigate to forgot and register pages", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("link", { name: /forgot password\?/i })).toHaveAttribute(
    "href",
    "/forgot-password"
  );
  await expect(page.getByRole("link", { name: /create account/i })).toHaveAttribute(
    "href",
    "/register"
  );
});
