import { test, expect } from '@playwright/test';

test.describe('First-visit manifesto', () => {
  test('a new visitor can read and close the manifesto', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Манифест Сообщества/i })).toBeVisible();
    await page.getByRole('button', { name: 'Close manifesto' }).click();
    await expect(page.getByRole('heading', { name: /Манифест Сообщества/i })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Open community hub' })).toBeVisible();
  });

  test('the first-visit state persists after reload', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Close manifesto' }).click();
    await page.reload();

    await expect(page.getByRole('heading', { name: /Манифест Сообщества/i })).not.toBeVisible();
  });
});
