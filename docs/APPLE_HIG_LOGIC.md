#  Apple Human Interface Guidelines (HIG) - Logique "Вайнах"

> "Less is more. Simplicity is the ultimate sophistication." — Steve Jobs

Ce document définit la philosophie de design de l'application **Вайнах**. Chaque modification doit être vérifiée par rapport à ces principes avant implémentation.

## 1. Principe de Clarté (Clarity)
L'application doit être immédiatement lisible. Pas de clutter. Pas de boutons redondants.
*   **Action unique** : Si un écran a plus de 3 boutons d'action principaux, c'est une erreur.
*   **Focus** : L'écran principal doit afficher l'essentiel : **La Carte et la Recherche**. Tout le reste doit être rangé ou contextuel.

## 2. Hiérarchie Visuelle & Regroupement (Progressive Disclosure)
La logique de développement adoptée est celle de la **Divulgation Progressive** :
*   Donner à l'utilisateur uniquement les informations dont il a besoin à l'instant T.
*   **Regroupement logique** : Toutes les fonctionnalités de "Contact" (Live location, Center me, Search) doivent être regroupées dans une seule interface cohérente (ex: une barre de recherche flottante omnipotente).
*   **Éviter le "bruit"** : Les boutons éparpillés aux quatre coins de l'écran sont proscrits.

## 3. Esthétique Apple (Glassmorphism & Micro-interactions)
*   **Matériaux** : Utilisation exclusive du `backdrop-blur` (Effet verre) et des coins ultra-arrondis (`rounded-[2rem]`).
*   **Contrastes** : Fond blanc cassé (`#fbfbfd`) et texte noir profond pour une lisibilité maximale.
*   **Transitions** : Chaque ouverture (Menu, Profil) doit être fluide et naturelle, pas instantanée.

## 4. "The Search is the App"
Dans le cas de **Вайнах**, la barre de recherche n'est pas un gadget, c'est le moteur central. 
*   **Omnibarre** : Taper "Avocat", "Live", "Membres" ou "Strasbourg" doit tout déclencher depuis un seul endroit. 
*   Le but est d'éliminer les boutons de filtres séparés au profit d'une intelligence de recherche.

---
**RÈGLE D'OR POUR LE DÉVELOPPEMENT :**
Si tu peux fusionner deux boutons en un seul menu contextuel ou une barre de recherche intelligente, fais-le. Si un élément visuel ne sert pas directement à trouver un frère/sœur ou une expertise, supprime-le.
