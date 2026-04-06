export interface HomelandPoint {
  name: string;
  nativeName: string;
  lat: number;
  lng: number;
  type: 'city' | 'ayul' | 'historical';
  description?: string;
}

export const HOMELAND_POINTS: HomelandPoint[] = [
  // Principal Cities
  { name: 'Grozny', nativeName: 'Sölz-Gala', lat: 43.317, lng: 45.698, type: 'city', description: 'Capital of the Chechen Republic.' },
  { name: 'Gudermes', nativeName: 'Gümse', lat: 43.35, lng: 46.1, type: 'city' },
  { name: 'Shali', nativeName: 'Shela', lat: 43.15, lng: 45.9, type: 'city' },
  { name: 'Urus-Martan', nativeName: 'Halk-Marta', lat: 43.13, lng: 45.54, type: 'city' },
  { name: 'Argun', nativeName: 'Ush-Gala', lat: 43.29, lng: 45.88, type: 'city' },
  { name: 'Kurchaloy', nativeName: 'Kuršloy-Gala', lat: 43.2, lng: 46.1, type: 'city' },

  // Famous Ayuls (Villages) - West
  { name: 'Bamut', nativeName: 'Bamut', lat: 43.1633, lng: 45.2008, type: 'ayul', description: 'Legendary fortress village.' },
  { name: 'Samashki', nativeName: 'Samaški', lat: 43.2906, lng: 45.3000, type: 'ayul' },
  { name: 'Achkhoy-Martan', nativeName: 'T\'ehl-Marta', lat: 43.195, lng: 45.302, type: 'ayul' },
  { name: 'Sernovodskoye', nativeName: 'Ezher-Yurt', lat: 43.317, lng: 45.155, type: 'ayul' },
  { name: 'Assinovskaya', nativeName: 'Eshkhoy-Evl', lat: 43.250, lng: 45.130, type: 'ayul' },
  { name: 'Zakan-Yurt', nativeName: 'Zakan-Yurt', lat: 43.265, lng: 45.420, type: 'ayul' },
  { name: 'Alkhan-Kala', nativeName: 'Alkhan-Gala', lat: 43.275, lng: 45.540, type: 'ayul' },
  { name: 'Gekhi', nativeName: 'Gekhi', lat: 43.1633, lng: 45.4722, type: 'ayul' },
  { name: 'Valerik', nativeName: 'Valerik', lat: 43.185, lng: 45.395, type: 'ayul' },

  // Central Region
  { name: 'Goyty', nativeName: 'Goyty', lat: 43.1642, lng: 45.6222, type: 'ayul' },
  { name: 'Alkhan-Yurt', nativeName: 'Alkhan-Yurt', lat: 43.2317, lng: 45.5722, type: 'ayul' },
  { name: 'Starye Atagi', nativeName: 'Atagi-Kila', lat: 43.18, lng: 45.73, type: 'ayul' },
  { name: 'Novye Atagi', nativeName: 'Atagi-Kerla', lat: 43.14, lng: 45.79, type: 'ayul' },
  { name: 'Chiri-Yurt', nativeName: 'Chiri-Yurt', lat: 43.0903, lng: 45.7483, type: 'ayul' },
  { name: 'Duba-Yurt', nativeName: 'Duba-Yurt', lat: 43.0411, lng: 45.7331, type: 'ayul' },
  { name: 'Shashan', nativeName: 'Shashani', lat: 43.415, lng: 45.922, type: 'ayul' },
  { name: 'Tolstoy-Yurt', nativeName: 'Doykur-Evl', lat: 43.4456, lng: 45.7792, type: 'ayul' },

  // East Region
  { name: 'Avtury', nativeName: 'Ebtura', lat: 43.14, lng: 46.01, type: 'ayul' },
  { name: 'Mesker-Yurt', nativeName: 'Mesker-Yurt', lat: 43.23, lng: 45.96, type: 'ayul' },
  { name: 'Tsotsin-Yurt', nativeName: 'Cocin-Yurt', lat: 43.245, lng: 46.035, type: 'ayul' },
  { name: 'Geldagan', nativeName: 'Geldagan', lat: 43.195, lng: 46.055, type: 'ayul' },
  { name: 'Mayrtup', nativeName: 'Mayrtup', lat: 43.215, lng: 46.160, type: 'ayul' },
  { name: 'Bachi-Yurt', nativeName: 'Bachi-Yurt', lat: 43.218, lng: 46.240, type: 'ayul' },
  { name: 'Goyty', nativeName: 'Goyt-Kkhu', lat: 43.265, lng: 46.335, type: 'ayul' },

  // South & Mountains
  { name: 'Benoy', nativeName: 'Benoy', lat: 42.9819, lng: 46.3069, type: 'historical', description: 'Ancestral home of the Benoy teip.' },
  { name: 'Vedeno', nativeName: 'Vedana', lat: 42.97, lng: 46.11, type: 'historical', description: 'Historical capital of Caucasian Imamate.' },
  { name: 'Shatoy', nativeName: 'Shuta', lat: 42.87, lng: 45.69, type: 'historical', description: 'Tower complex region.' },
  { name: 'Itum-Kali', nativeName: 'Iton-Khala', lat: 42.73, lng: 45.57, type: 'historical', description: 'Ancient towers and stone castles.' },
  { name: 'Kharachoy', nativeName: 'Kharachoy', lat: 42.930, lng: 46.135, type: 'ayul', description: 'Entrance to the high mountains.' },
  { name: 'Makazhoy', nativeName: 'Makʼazhoy', lat: 42.785, lng: 46.140, type: 'historical', description: 'Region of Kezenoy-Am lake.' },
  { name: 'Nozhay-Yurt', nativeName: 'Naža-Yurt', lat: 43.09, lng: 46.38, type: 'historical' },
  { name: 'Sharoy', nativeName: 'Sharoy', lat: 42.635, lng: 45.805, type: 'historical' },

  // North (Terek Region)
  { name: 'Naurskaya', nativeName: 'Naur', lat: 43.65, lng: 45.45, type: 'historical' },
  { name: 'Shelkovskaya', nativeName: 'Merk-Yurt', lat: 43.51, lng: 46.33, type: 'historical' },
  { name: 'Znamenskoye', nativeName: 'Chulga-Yurt', lat: 43.680, lng: 45.130, type: 'historical' },
];

export const CHECHNYA_BORDER_POINTS: [number, number][] = [
  [43.85, 45.30], [44.02, 45.85], [44.05, 46.25], [43.65, 47.05], 
  [43.25, 46.90], [42.85, 46.60], [42.45, 46.35], [42.40, 45.95],
  [42.35, 45.50], [42.50, 45.15], [42.80, 44.95], [43.15, 44.75],
  [43.45, 44.70], [43.70, 44.90]
];
