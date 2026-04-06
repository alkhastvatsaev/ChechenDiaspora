# Global Chechen Diaspora Hub - État du Projet & Logique

Ce document résume le travail accompli jusqu'à présent sur la PWA "Global Chechen Diaspora Hub", ainsi que la logique technique et philosophique qui sous-tend ces développements. Il sert de point de repère pour comprendre où en est l'application et comment elle a été conçue.

## 1. Mission et Philosophie Principale
*   **Objectif** : Créer un "Contact Book" global et collaboratif pour la diaspora tchétchène. 
*   **Levier Communautaire** : Permettre aux membres de la diaspora de trouver rapidement des experts (Avocats, Notaires, Politiciens, Entrepreneurs, etc.) afin d'utiliser la puissance du réseau pour consolider et aider la communauté.
*   **Fonctionnel, sans "fluff"** : L'application n'est pas un réseau social classique. Elle se concentre sur l'utilité brute ("Bridge function" pour l'entraide Tchétchène-à-Tchétchène).
*   **Croissance Virale** : Logique d'expansion où l'outil attire le besoin, et le besoin nourrit la base de données de contacts.

## 2. Architecture Technique
Le projet a été mis en place avec une stack technique moderne et robuste pour garantir performance (même avec des cartes complexes) et évolutivité :
*   **Framework Core** : Next.js (React) pour le rendu et le routage.
*   **PWA (Progressive Web App)** : Conçu pour être installable sur mobile et bureau tel un outil natif.
*   **Base de Données / Backend** : Prévu avec Firebase pour gérer la croissance des 2000+ contacts et gérer les mises à jour en temps réel.
*   **Cartographie interactive** : Intégration de `react-leaflet` et Leaflet classique pour une carte mondiale interactive performante (capable de gérer de lourds fichiers GeoJSON).
*   **Contrôle d'Accès** : Système de mot de passe communautaire (Passphrase) pour garder l'équilibre entre l'ouverture au peuple et la sécurité face aux entités externes.

## 3. Travail Réussi & Interface (UI/UX)
*   **UI "Glassmorphism"** : L'interface utilisateur (Headers, Sidebars, Modals) utilise des effets de verre trempé (flou, transparence) pour donner un aspect "Premium" et ancré dans le web moderne, comme exigé dans le cahier des charges.
*   **Code Couleur Significatif** : 
    *   **Bleu Tchétchène** (`#007AFF`) : Utilisé pour représenter la diaspora éclatée dans le monde.
    *   **Vert** : Utilisé pour la République Tchétchène (Homeland) et ses monuments historiques.
*   **Filtres et Recherche** : Mise en place logique d'une interface pour localiser / filtrer les membres selon leur profession et expertise.
*   **Section Héritage (`/heritage`)** : Intégration d'une page et d'une base de données (`chechen_lore.ts`) pour lier la diaspora à l'histoire et aux lieux sacrés/historiques du pays.

## 4. Logique Cartographique Absolue (Derniers gros travaux)
Nous avons passé une étape cruciale concernant la précision de la carte interactive :
*   **Adieu aux Cercles Génériques (Halos)** : Au début, les villes de la diaspora étaient représentées par des cercles d'un rayon de 12km dessinés automatiquement.
*   **Données GeoJSON Massives (`diaspora_borders.json`)** : Nous avons injecté des données topographiques exactes (plus de 5 Mo de coordonnées directes) pour dessiner les contours réels des zones administratives (Los Angeles, Chicago, Toronto, villes d'Europe, etc.).
*   **Rendu "Premium"** : Sur la carte actuelle, plutôt qu'un indicateur basique, chaque ville hébergeant une communauté possède **la ligne continue exacte** (Solid Line bleue) de sa municipalité. Cela renforce l'aspect ultra-qualitatif et précis ("Contact Book" sérieux) de la plateforme.

## 5. Prochaines Étapes Logiques
Maintenant que le squelette, le design system, et la cartographie précise sont en place :
1.  **Peuplement dynamique** : Lier la carte et les filtres aux vrais contacts (synchronisation Firestore).
2.  **Formulaire d'Ajout** : Intégrer la proposition de nouveaux experts par les membres (Crowdsourcing de contacts).
3.  **Optimisation** : S'assurer que le fichier `diaspora_borders.json` est bien caché/compressé au niveau du CDN (Vercel) pour que l'application reste rapide au chargement initial.
