import { test, expect } from '@playwright/test';

// Configuration for local or build testing
const PORT = process.env.PORT || 3000;
const URL = `http://localhost:${PORT}`;

test.describe('Authentication Loop Protection (Adat Protection)', () => {
  
  test('Access to / without passphrase should redirect to /login once', async ({ page }) => {
    // We go to the root
    await page.goto(URL);
    
    // We must be at /login
    await expect(page).toHaveURL(/.*login/);
    
    // The page must contain the title "Вайнах"
    const title = page.locator('h1');
    await expect(title).toContainText('Вайнах');
    
    // Check console for potential infinite reloads (Next.js typically warns or fails)
    // We wait 2 seconds to see if a loop occurs
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });

  test('Valid passphrase "вайнах" (cyrillic) should unblock access and persist', async ({ page }) => {
    await page.goto(`${URL}/login`);
    
    // Type the community password
    await page.fill('input[type="password"]', 'вайнах');
    await page.click('button[type="submit"]');
    
    // Check loading/welcome state
    await expect(page.locator('text=Маршалла хуьлда')).toBeVisible();
    
    // Final redirect to dashboard
    await page.waitForURL(URL, { timeout: 10000 });
    await expect(page).toHaveURL(URL);
    
    // Verify common dashboard elements
    await expect(page.locator('h2')).toContainText('Кхерч');
  });

  test('Invalid passphrase should keep user on /login and show error', async ({ page }) => {
    await page.goto(`${URL}/login`);
    await page.fill('input[type="password"]', 'wrong_passphrase');
    await page.click('button[type="submit"]');
    
    // Should stay on login and show the Adat-style error
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('text=Харц ду')).toBeVisible();
  });
});
