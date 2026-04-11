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
    await page.goto('/');

    // Click on the Hub tab (second button in the tab bar)
    // The tab bar is an around-justified flexbox. 
    // Let's find by text "Хаб"
    const hubTab = page.getByText('Хаб', { exact: false });
    await hubTab.click();

    // Check if Hub title is visible
    await expect(page.getByText('Кхерч / Хаб')).toBeVisible();

    // Check if search bar is present
    await expect(page.getByPlaceholder(/Найти земляка/i)).toBeVisible();
  });
});
