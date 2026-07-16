import { test, expect } from '@playwright/test';

test.describe('Anonymous session routing', () => {
  test('the home page is available without the client passphrase', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/');
    await expect(page.locator('h1', { hasText: 'Вайнах' })).toBeVisible();
  });

  test('the legacy login route returns to the home page without looping', async ({ page }) => {
    await page.goto('/login');

    await expect(page).toHaveURL('/');
    await expect(page.locator('h1', { hasText: 'Вайнах' })).toBeVisible();
  });
});
