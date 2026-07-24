import { test, expect } from '@playwright/test';

// VWO login test with resilient, accessibility-based locators
test.describe('VWO Login', () => {
  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('https://app.wingify.com/#/login');

    await page.locator('#login-username').fill('wrong@example.com');
    await page.locator('#login-password').fill('badpassword123');
    await page.locator('#js-login-btn').click();

    await expect(page.getByText(/did not match/i)).toBeVisible();
  });

  test('should navigate to free trial signup', async ({ page }) => {
    await page.goto('https://app.wingify.com/#/login');

    await page.getByRole('link', { name: 'Start a free trial' }).click();
    await expect(page.getByText('free trial')).toBeVisible();
  });
});
