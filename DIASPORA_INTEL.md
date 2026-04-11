# 🌍 Vainakh Diaspora Hub: Intelligence & Mission Documents

Ce document compile les recherches, les données démographiques et les choix de conception culturelle effectués pour moderniser la plateforme Chechen Diaspora Hub en une véritable "Maison de l'Entraide" (Бёлхи).

---

## 🛡️ 1. Vision et Adab (Éthique)

Le projet repose sur la dignité (**Yah**) et la solidarité de la diaspora. Chaque élément de l'interface a été ajusté pour refléter notre identité :

- **Terminologie Sacrée** : Utilisation exclusive du terme **Аллах (الله)**.
- **Dua de Clôture** : Conclusion du Manifeste par une invocation sincère : *"Да облегчит Аллах наш путь и поможет нам во всём благом. وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ"*
- **Dignité (No Filler)** : Suppression des icônes de "main tendue" ou d'assistance condescendante. L'entraide se fait entre pairs, d'égal à égal.
- **Authenticité des Noms** : Utilisation de prénoms traditionnels Vainakh pour le peuplement de l'application (Zelimkhan, Aminat, Malika, Muhammad, Turpal, Baysangur).

---

## 📊 2. Données Démographiques Mondiales

Estimations approximatives utilisées pour la visualisation de la carte (Basé sur les vagues de 1944, les guerres de 1990-2000 et les migrations historiques du XIXe siècle).

| Pays / Zone | Population Est. | Type de Diaspora | Points Clés (Hubs) |
| :--- | :--- | :--- | :--- |
| **Turquie** | ~100,000+ | Historique (XIXe) | Istanbul, Kayseri, Sivas |
| **France** | ~67,000 | Contemporaine | Nice, Strasbourg, Paris, Nantes |
| **Kazakhstan** | ~45,000 | Déportation (1944) | Almaty, Astana, Karaganda |
| **Allemagne** | ~50,000 | Contemporaine | Berlin, Hamburg, Bremen |
| **Autriche** | ~30,000 | Contemporaine | Vienne |
| **Belgique** | ~17,000 | Contemporaine | Bruxelles, Anvers |
| **Jordanie** | ~15,000 | Historique (XIXe) | Amman, Zarqa, Sukhnah |
| **Irak** | ~15,000 | Historique (XIXe) | Kirkuk, Baghdad |
| **Pologne** | ~15,000 | Gateway / Transition | Varsovie, Bialystok |
| **Norvège** | ~10,000 | Contemporaine | Oslo, Stavanger |
| **Géorgie** | ~8,000 | Indigène (Kistines) | Duisi (Pankisi Gorge) |
| **Finlande** | ~3,000+ | Contemporaine | Helsinki |

---

## 🛠️ 3. Architecture de la "Maison de l'Entraide" (Бёлхи)

La plateforme a été optimisée pour la mise en relation ultra-rapide entre ceux qui ont besoin d'aide et ceux qui peuvent en offrir.

### A. Pop-up de Découverte des Experts
- **Accès Direct** : Au lieu d'ouvrir une fenêtre complète, des billes d'expertise (Avocat, Juriste, Traducteur, etc.) ouvrent un pop-up flottant au-dessus de la carte.
- **Contextualisation Géographique** : Affichage systématique du **Pays** de l'expert pour orienter l'utilisateur.
- **Contact WhatsApp** : Bouton d'action directe pour initier une conversation sans intermédiaire.

### B. Onboarding & Manifeste
- **First Visit Logic** : Le Manifeste ne s'affiche automatiquement que lors de la **toute première connexion** d'un utilisateur (via LocalStorage). 
- **Accès Permanent** : Il reste disponible dans les onglets, mais ne bloque plus l'utilisation quotidienne de la carte pour les utilisateurs récurrents.

---

## 📍 Master Diaspora Zones Registry (2026)
*Toutes ces zones sont gérées dans `src/data/diaspora_master_zones.json` avec des polygones administratifs réels.*

### 🇪🇺 Europe
- **Paris & Île-de-France** (Forte concentration historique)
- **Nice & Côte d'Azur** (Foyer majeur du sud)
- **Strasbourg & Grand Est** (Présence institutionnelle)
- **Marseille** (Portail méditerranéen)
- **Berlin & Bremen** (Cœur de la diaspora allemande)
- **Bruxelles & Anvers** (Centre logistique européen)
- **Vienne & Linz** (Forte densité historique)
- **Oslo Region** (Scandinavie)

### 🇰🇿 Asie Centrale (Routes de 1944)
- **Almaty & Zone Sud** (Triangle d'or de la diaspora)
- **Astana** (Nouveau centre névralgique)
- **Karaganda** (Zone minière et historique)

### 🇹🇷 Moyen-Orient & Anatolie
- **Istanbul & Yalova** (Foyer massif et maritime)
- **Sivas & Anatolie Centrale** (Villages traditionnels)
- **Amman & Zarqa** (Descendants des Muhajirs)

### 🇬🇪 Caucase (Hors Tchétchénie)
- **Vallée de Pankissi (Duisi)** (Lien direct avec la terre)

### 🇺🇸 Amérique
- **New York / New Jersey** (Diaspora émergente)

---

## 🎨 4. Design System "Less is More"

Inspiré par le minimalisme d'Apple, le design priorise le contenu sacré et opérationnel :
- **Header Épuré** : Suppression des boutons redondants pour concentrer l'action sur la barre du bas.
- **Badges Statistiques** : Affichage discret des chiffres de population (Badges de Présence) visibles uniquement en vue globale pour éviter la pollution visuelle.
- **Iconographie Logique** : Remplacement des icônes superflues (Flammes, Boucliers) par des symboles universels comme le **Globe** (Diaspora mondiale).

---

*Document généré le 11 Avril 2026 pour le projet Chechen Diaspora Hub.*
