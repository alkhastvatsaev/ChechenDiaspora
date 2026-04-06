import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright pour le bouclier communautaire "Вайнах"
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Exécuter les tests en parallèle sur le CI */
  fullyParallel: true,
  /* Échouer le build sur CI si on oublie un .only dans le code */
  forbidOnly: !!process.env.CI,
  /* Réessayer une fois sur CI */
  retries: process.env.CI ? 2 : 0,
  /* Opt-out du parallélisme sur CI pour plus de stabilité si besoin */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter à utiliser. Voir https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Configuration partagée pour tous les projets ci-dessous. Voir https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* URL de base pour les tests. */
    baseURL: 'http://localhost:3000',

    /* Collecter les traces lors des échecs. Voir https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Screenshots auto sur échec */
    screenshot: 'only-on-failure',
  },

  /* Configurer les projets pour les navigateurs majeurs */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  /* Lancer le serveur local avant de tester */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
