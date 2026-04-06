/**
 * Файл Знаний: Историческая, культурная и социальная логика Чеченского народа.
 * Core Knowledge File: Historical, cultural, and social logic of the Chechen people.
 * 
 * Ce fichier sert de base de connaissances absolue (source of truth) pour l'application 
 * (PWA) et pour l'agent IA (Antigravity). Il contient la logique profonde du peuple tchétchène,
 * ses dynamiques sociales, et son histoire.
 */

export const ChechenLore = {
  identity: {
    ethnonym: "Nokhchi (Нохчий)",
    language: "Chechen (Nokhchiin Mott - Нохчийн мотт) - Vainakh branch of the Northeast Caucasian languages.",
    core_concept: "Nokhchalla (Нохчалла)",
    nokhchalla_definition: "Plus qu'un code d'honneur, c'est l'essence même de la 'tchétchénité'. Cela englobe le courage, la fierté, la justice, mais aussi et surtout le respect absolu des aînés, la modestie, l'hospitalité inconditionnelle, et l'égalité entre les hommes (aucun Tchétchène n'est supérieur à un autre de par sa naissance). Un 'Konakh' (homme d'honneur) doit suivre le Nokhchalla."
  },
  
  social_structure: {
    system: "Egalitarian Clan-based society (Société clanique égalitaire). Contrairement aux émirats ou royaumes voisins, la Tchétchénie s'est construite sur une démocratie militaire rurale sans monarque.",
    teip: {
      definition: "Le 'Teip' (Тайп) est le clan patriarcal. C'est l'unité de base de la société tchétchène.",
      role: "Il définit l'origine, protège ses membres (historiquement par la vendetta/prix du sang), et gère les ressources locales. Il existe plus de 130 teips.",
      examples: ["Benoy", "Gendargnoy", "Alkhast", "Peshkhoy", "Tsentaroy", "Ersenoy", "Chinkhoy"]
    },
    tukhum: {
      definition: "Le 'Tukhum' (Тусхам) est une alliance ou confédération de plusieurs Teips.",
      role: "Historiquement créé pour des raisons militaires et diplomatiques (défense régionale). Il y a 9 Tukhums principaux (représentés par les 9 étoiles sur le drapeau d'Ichkérie).",
      examples: ["Akkhiy", "Malkhiy", "Nokhchmakhkoy", "Orstkhoy", "Terloy", "Chantiy", "Cheberloy", "Sharoy", "Shatoy"]
    },
    adat: "Le droit coutumier (Adat). Avant et en parallèle de la Sharia, l'Adat règle les conflits de la vie courante, les règles du mariage, le prix du sang, et la gestion du territoire selon les traditions ancestrales."
  },

  history: {
    ancient_medieval: "Le peuple Vainakh réside dans le Caucase depuis des millénaires. Au Moyen Âge, ils ont résisté aux invasions mongoles et à Tamerlan. Christianisés un temps, ils se sont tournés vers l'Islam sous la pression des guerres et de l'Empire Ottoman/Perse.",
    caucasian_wars: {
      period: "1785 - 1864",
      description: "Guerre d'indépendance massive contre l'Empire Russe au 19ème siècle. Une résistance féroce et asymétrique.",
      leaders: [
        { name: "Sheikh Mansur", role: "Premier Imam du Caucase", era: "Fin 18e siècle" },
        { name: "Imam Shamil", role: "Chef de l'Imamat du Caucase (Avar, mais unificateur des Tchétchènes et Daghestanais)", era: "19e siècle" },
        { name: "Baysangur de Benoy", role: "Naib (commandant) légendaire, a continué le combat même amputé d'un bras, d'une jambe et d'un oeil.", era: "19e siècle" }
      ]
    },
    soviet_deportation: {
      event: "Aardakh (La Déportation) - Opération Tchétchévitsa (Lentille)",
      date: "23 Février 1944",
      description: "Sur ordre direct de Staline, la population entière de la nation (Tchétchènes et Ingouches) a été forcée de monter dans des trains à bestiaux et déportée vers le Kazakhstan et la Sibérie. Près de 50% de la population a péri de froid, faim ou maladie. Retour autorisé seulement en 1957."
    },
    modern_wars: {
      first_war: "1994 - 1996 : La République Tchétchène d'Ichkérie (indépendante) bat l'armée russe lors d'une guérilla massive et force un traité de paix.",
      second_war: "1999 - 2009 : La Russie (sous Poutine) relance une campagne dévastatrice. Grozny est rasée, des centaines de milliers de réfugiés (naissance de la diaspora moderne)."
    }
  },

  political_figures: {
    independence_era: [
      { name: "Dzhokhar Dudayev", role: "1er Président de la République Tchétchène d'Ichkérie. Figure emblématique de l'indépendance." },
      { name: "Zelimkhan Yandarbiyev", role: "2ème Président (intérim). Théoricien." },
      { name: "Aslan Maskhadov", role: "3ème Président élu. Chef d'état-major pendant la 1ère guerre." }
    ],
    russian_federation_era: [
      { name: "Akhmad Kadyrov", role: "Ancien mufti séparatiste passé du côté fédéral. Tué en 2004." },
      { name: "Ramzan Kadyrov", role: "Chef actuel de la République Tchétchène sous la Fédération de Russie." }
    ]
  },

  geography: {
    region: "Nord-Caucase",
    capital: "Grozny (Sölzha-Ghala en tchétchène)",
    major_cities: ["Argun", "Shali", "Gudermes", "Urus-Martan"],
    terrain: "Partie sud montagneuse (chaîne principale du Caucase), partie nord composée de plaines et rivières (Terek, Sunzha).",
    diaspora: "La guerre et les conjonctures politiques ont poussé plus de 300 000 Tchétchènes à former une diaspora, majoritairement en Europe (France, Allemagne, Autriche, Belgique), au Moyen-Orient (Jordanie) et en Turquie. Cette PWA est construite pour réunir cette diaspora."
  },

  religion: {
    faith: "Islam Sunni (École juridique Shafi'ite)",
    sufism: "Le Soufisme est le cœur spirituel. Il y a deux grandes confréries (Tariqas) : la Qadiriyya (enseignée par Kunta-Haji) et la Naqshbandiyya. Les Tchétchènes pratiquent le 'Zikr' (dhikr) bruyant et dynamique, un élément identitaire fort."
  }
};
