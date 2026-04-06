import { test, expect } from '@playwright/test';

test.describe('Foyer "Вайнах" - Parcours Mission-First', () => {
  
  test('un nouvel utilisateur doit lire et accepter le manifeste avant d\'accéder à la carte', async ({ page }) => {
    // Aller sur la page d'accueil
    await page.goto('/');

    // Vérifier que le manifeste est affiché
    await expect(page.getByText(/Manifeste de la Diaspora/i)).toBeVisible();
    await expect(page.getByText(/Le Fardeau et l'Excellence/i)).toBeVisible();

    // Vérifier que le bouton d'acceptation est en bas (défilement simulé par l'action de clic)
    const acceptButton = page.getByRole('button', { name: /J'AI LU ET J'ACCEPTE LA MISSION/i });
    
    // Le bouton doit être visible au bout du compte
    await acceptButton.scrollIntoViewIfNeeded();
    await expect(acceptButton).toBeVisible();

    // Cliquer sur le bouton d'acceptation
    await acceptButton.click();

    // Vérifier que l'overlay disparaît et que la carte s'affiche
    // On cherche un élément spécifique à la carte ou à la sidebar d'experts
    await expect(page.getByText(/Вайнах /i, { exact: false })).toBeVisible();
    
    // Vérifier la présence des icônes d'expertise dans la sidebar gauche (ex: Gavel pour avocat)
    // Selon l'implémentation de page.tsx, on peut chercher par rôle ou texte
    const expertSidebar = page.locator('aside, .flex.h-\\[100dvh\\]');
    await expect(expertSidebar).toBeVisible();
  });

  test('l\'acceptation du manifeste doit persister en session', async ({ page }) => {
    await page.goto('/');
    
    // Accepter le manifeste
    await page.getByRole('button', { name: /J'AI LU ET J'ACCEPTE LA MISSION/i }).click();
    
    // Recharger la page
    await page.reload();

    // Le manifeste ne doit plus être visible directement (session persistence)
    await expect(page.getByText(/Le Fardeau et l'Excellence/i)).not.toBeVisible();
  });
});
