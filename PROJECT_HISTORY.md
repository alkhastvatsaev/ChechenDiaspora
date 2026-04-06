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

## 4. Révolution Conceptuelle : "Кхерч", "Орца" et "Бёлхи"
Au de-là de la forme, le fond de l'application a pris une toute autre dimension pour avoir "une âme" qui correspond purement au code *Nokhchalla* :
*   **Кхерч (Le Foyer/Hearth)** : L'interface principale et la modale ont été redesignées avec une palette chaleureuse (`hearth-amber`, `vainakh-stone`, `kherch-dark`). La sidebar n'est plus un vulgaire menu de navigation, mais symbolise le Foyer où chaque frère/sœur est accueilli ("Марша догIийла"). 
*   **Орца (Bouton SOS)** : Un grand bouton pulsant, placé au cœur de l'application. Symbolise l'obligation vitale d'assistance immédiate si un membre de la communauté est en péril dans une ville spécifique.
*   **Бёлхи (Travail/Mutual Aid)** : Les fiches techniques (Profil des membres) ne disent plus "Profession" ou "Proposer service" (connotation trop commerciale), mais "Бёлхи" et incitent à contacter le "frère/sœur".
*   **Généalogie / Identité** : Les cartes membres mettent désormais l'accent sur le *Teip* et le *Village* d'origine.

## 5. Logique Cartographique Absolue (Derniers gros travaux)
Nous avons passé une étape cruciale concernant la précision de la carte interactive :
*   **Adieu aux Cercles Génériques (Halos)** : Au début, les villes de la diaspora étaient représentées par des cercles d'un rayon de 12km dessinés automatiquement.
*   **Données GeoJSON Massives (`diaspora_borders.json`)** : Nous avons injecté des données topographiques exactes (plus de 5 Mo de coordonnées directes) pour dessiner les contours réels des zones administratives (Los Angeles, Chicago, Toronto, villes d'Europe, etc.).

## 6. Phase de Stabilisation & Identité "Вайнах" (Dernières Mises à Jour)

Nous avons franchi une étape majeure pour rendre l'application prête au déploiement réel et à l'usage quotidien :

*   **Refonte Apple Minimaliste** : L'interface a été épurée pour adopter un style "Apple-like" (Fonds blancs `#fbfbfd`, typos Arial Bold, contrastes noirs profonds). Le but : une sensation de "premium" immédiate.
*   **Système d'Accès "Vérifié"** : 
    *   La passphrase communautaire est désormais : **`Вайнах`** (insensible à la casse).
    *   **Fix Critique** : Correction de la boucle de redirection infinie au login. L'application possède maintenant un système de vérification locale par session, garantissant l'accès même si les services Firebase sont temporairement lents.
*   **Introduction du "Дошлор" (Doshlor)** : 
    *   Création d'une archive linguistique interactive au sein de la section `/heritage`.
    *   Moteur de recherche performant pour le dictionnaire Tchétchène-Français-Russe.
    *   Base de données évolutive pour préserver la langue dans la diaspora.
*   **Modération & Recrutement Hub** : 
    *   Mise en place d'un flux d'admission sécurisé (`/join`). Les nouveaux membres postulent et apparaissent sur la carte uniquement après validation par un administrateur (`/admin`).
    *   Intégration du manifeste **Nokhchalla** sur chaque profil membre (rappel de l'entraide gratuite et du respect de l'Adat).

## 7. État Actuel du Déploiement

*   **GitHub / Vercel** : Le code est synchronisé en temps réel sur la branche `main`.
*   **Firebase** : L'architecture est prête à recevoir les 2000+ contacts. Le système de "Lazy Initialization" évite les crashs lors du build sur Vercel.
*   **Accès Test** : 
    *   Passphrase Hub : `Вайнах`
    *   Admin Panel : `/admin` (Code: `chechnyalive`)

## 8. Prochaines Étapes Prioritaires

1.  **Importation Massive** : Commencer le "Peuplement" réel de la base avec les 2000 contacts existants.
2.  **SOS Notifications (Орца)** : Finaliser le système de notifications Push pour le bouton d'urgence.
3.  **Mode Hors-Ligne (PWA)** : Optimiser la mise en cache pour que le Dictionnaire et la Carte soient consultables sans connexion (utile en déplacement).
