import { test, expect } from '@playwright/test';

test.describe('Vainakh App E2E', () => {
  test('should load the home page and show the main title', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Check if the title is visible
    const title = page.locator('h1', { hasText: 'Вайнах' });
    await expect(title).toBeVisible();
  });

  test('should switch to Hub tab and show the search bar', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('vainakh_has_seen_manifesto', 'true');
    });
    await page.goto('/');

    await page.getByRole('button', { name: 'Open community hub' }).click();

    await expect(page.getByRole('heading', { name: 'Вайнехан Бёлхи' })).toBeVisible();

    await expect(page.getByPlaceholder('Чем мы можем помочь?')).toBeVisible();
  });
});
