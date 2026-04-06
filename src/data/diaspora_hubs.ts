export interface DiasporaHub {
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export const DIASPORA_HUBS: DiasporaHub[] = [
  // France
  { name: "Nice", country: "France", lat: 43.7102, lng: 7.2620 },
  { name: "Strasbourg", country: "France", lat: 48.5734, lng: 7.7521 },
  { name: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { name: "Marseille", country: "France", lat: 43.2965, lng: 5.3698 },
  { name: "Orléans", country: "France", lat: 47.9029, lng: 1.9093 },
  { name: "Le Mans", country: "France", lat: 48.0061, lng: 0.1996 },
  { name: "Besançon", country: "France", lat: 47.2378, lng: 6.0241 },
  { name: "Montpellier", country: "France", lat: 43.6108, lng: 3.8767 },
  { name: "Toulouse", country: "France", lat: 43.6047, lng: 1.4442 },
  { name: "Tours", country: "France", lat: 47.3941, lng: 0.6848 },
  { name: "Saint-Étienne", country: "France", lat: 45.4397, lng: 4.3872 },
  { name: "Rennes", country: "France", lat: 48.1173, lng: -1.6778 },
  { name: "Dijon", country: "France", lat: 47.3220, lng: 5.0415 },
  { name: "Melun", country: "France", lat: 48.5406, lng: 2.6603 },
  { name: "Lille", country: "France", lat: 50.6292, lng: 3.0573 },
  { name: "Albi", country: "France", lat: 43.9289, lng: 2.1464 },
  { name: "Nîmes", country: "France", lat: 43.8367, lng: 4.3601 },
  { name: "Angers", country: "France", lat: 47.4784, lng: -0.5532 },
  { name: "Clermont-Ferrand", country: "France", lat: 45.7772, lng: 3.0870 },
  
  // Germany
  { name: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
  { name: "Hambourg", country: "Germany", lat: 53.5511, lng: 9.9937 },
  { name: "Munich", country: "Germany", lat: 48.1351, lng: 11.5820 },
  { name: "Mannheim", country: "Germany", lat: 49.4875, lng: 8.4660 },
  { name: "Nuremberg", country: "Germany", lat: 49.4521, lng: 11.0767 },
  { name: "Aschaffenbourg", country: "Germany", lat: 49.9749, lng: 9.1436 },

  // Austria
  { name: "Vienne", country: "Austria", lat: 48.2082, lng: 16.3738 },

  // Belgium
  { name: "Bruxelles", country: "Belgium", lat: 50.8503, lng: 4.3517 },
  { name: "Aarschot", country: "Belgium", lat: 50.9850, lng: 4.8361 },
  { name: "Anvers", country: "Belgium", lat: 51.2194, lng: 4.4025 },
  { name: "Ostende", country: "Belgium", lat: 51.2154, lng: 2.9287 },
  { name: "Louvain", country: "Belgium", lat: 50.8798, lng: 4.7005 },
  { name: "Namur", country: "Belgium", lat: 50.4674, lng: 4.8712 },
  { name: "Bredene", country: "Belgium", lat: 51.2384, lng: 2.9739 },
  { name: "Hasselt", country: "Belgium", lat: 50.9307, lng: 5.3325 },
  { name: "Verviers", country: "Belgium", lat: 50.5936, lng: 5.8624 },
  { name: "Gand", country: "Belgium", lat: 51.0543, lng: 3.7167 },
  { name: "Arlon", country: "Belgium", lat: 49.6833, lng: 5.8167 },
  { name: "Liège", country: "Belgium", lat: 50.6326, lng: 5.5797 },

  // Norway
  { name: "Oslo", country: "Norway", lat: 59.9139, lng: 10.7522 },
  { name: "Sandvika", country: "Norway", lat: 59.8911, lng: 10.5264 },
  { name: "Lillestrøm", country: "Norway", lat: 59.9535, lng: 11.0505 },
  { name: "Stavanger", country: "Norway", lat: 58.9690, lng: 5.7331 },

  // Turkey
  { name: "Istanbul", country: "Turkey", lat: 41.0082, lng: 28.9784 },
  { name: "Kayseri", country: "Turkey", lat: 38.7312, lng: 35.4787 },
  { name: "Sivas", country: "Turkey", lat: 39.7477, lng: 37.0166 },

  // Jordan
  { name: "Amman", country: "Jordan", lat: 31.9454, lng: 35.9284 },
  { name: "Zarqa", country: "Jordan", lat: 32.0620, lng: 36.0968 },
  { name: "Mafraq", country: "Jordan", lat: 32.3456, lng: 36.2081 },

  // Russia
  { name: "Moscou", country: "Russia", lat: 55.7558, lng: 37.6173 },
  { name: "Saint-Pétersbourg", country: "Russia", lat: 59.9311, lng: 30.3609 },
  { name: "Tyumen", country: "Russia", lat: 57.1522, lng: 65.5272 },
  { name: "Yaroslavl", country: "Russia", lat: 57.6299, lng: 39.8737 },
  { name: "Ryazan", country: "Russia", lat: 54.6269, lng: 39.7405 },
  { name: "Voronezh", country: "Russia", lat: 51.6720, lng: 39.1843 },
  { name: "Novgorod", country: "Russia", lat: 58.5256, lng: 31.2742 },
  { name: "Saratov", country: "Russia", lat: 51.5406, lng: 46.0086 },
  { name: "Astrakhan", country: "Russia", lat: 46.3497, lng: 48.0408 },
  { name: "Volgograd", country: "Russia", lat: 48.7080, lng: 44.5133 },
  { name: "Khabarovsk", country: "Russia", lat: 48.4814, lng: 135.0760 },
  { name: "Vladivostok", country: "Russia", lat: 43.1198, lng: 131.8869 },
  { name: "Stavropol", country: "Russia", lat: 45.0428, lng: 41.9734 },
  { name: "Rostov-sur-le-Don", country: "Russia", lat: 47.2313, lng: 39.7233 },
  { name: "Krasnodar", country: "Russia", lat: 45.0393, lng: 38.9872 },
  { name: "Elista", country: "Russia", lat: 46.3078, lng: 44.2758 },
  { name: "Ufa", country: "Russia", lat: 54.7388, lng: 55.9721 },
  { name: "Kazan", country: "Russia", lat: 55.7963, lng: 49.1088 },
  { name: "Ekaterinburg", country: "Russia", lat: 56.8389, lng: 60.6057 },
  { name: "Chelyabinsk", country: "Russia", lat: 55.1644, lng: 61.4368 },
  { name: "Petrozavodsk", country: "Russia", lat: 61.7849, lng: 34.3469 },
  { name: "Ulianovsk", country: "Russia", lat: 54.3141, lng: 48.4031 },
  { name: "Makhachkala", country: "Russia", lat: 42.9772, lng: 47.4939 },
  { name: "Nazran", country: "Russia", lat: 43.2268, lng: 44.7554 },

  // UK & USA & NL
  { name: "Londres", country: "UK", lat: 51.5074, lng: -0.1278 },
  { name: "New York", country: "USA", lat: 40.7128, lng: -74.0060 },
  { name: "Boston", country: "USA", lat: 42.3601, lng: -71.0589 },
  { name: "Miami", country: "USA", lat: 25.7617, lng: -80.1918 },
  { name: "Rotterdam", country: "Netherlands", lat: 51.9225, lng: 4.4791 },
  { name: "Dordrecht", country: "Netherlands", lat: 51.8133, lng: 4.6900 },

  // Syria
  { name: "Quneitra", country: "Syria", lat: 33.1257, lng: 35.8246 },
  { name: "Ras al-Ain", country: "Syria", lat: 36.8488, lng: 40.0664 },
  { name: "Qamishli", country: "Syria", lat: 37.0500, lng: 41.2222 },
  { name: "Raqqa", country: "Syria", lat: 35.9528, lng: 39.0069 },
  { name: "Deir ez-Zor", country: "Syria", lat: 35.3344, lng: 40.1417 }
];
