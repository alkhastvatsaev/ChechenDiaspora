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

  // Famous Ayuls (Villages)
  { name: 'Benoy', nativeName: 'Benoy', lat: 42.9819, lng: 46.3069, type: 'ayul', description: 'Ancestral home of the Benoy teip.' },
  { name: 'Bamut', nativeName: 'Bamut', lat: 43.1633, lng: 45.2008, type: 'ayul' },
  { name: 'Samashki', nativeName: 'Samaški', lat: 43.2906, lng: 45.3000, type: 'ayul' },
  { name: 'Gekhi', nativeName: 'Gekhi', lat: 43.1633, lng: 45.4722, type: 'ayul' },
  { name: 'Goyty', nativeName: 'Goyty', lat: 43.1642, lng: 45.6222, type: 'ayul' },
  { name: 'Alkhan-Yurt', nativeName: 'Alkhan-Yurt', lat: 43.2317, lng: 45.5722, type: 'ayul' },
  { name: 'Tolstoy-Yurt', nativeName: 'Doykur-Evl', lat: 43.4456, lng: 45.7792, type: 'ayul' },
  { name: 'Chiri-Yurt', nativeName: 'Chiri-Yurt', lat: 43.0903, lng: 45.7483, type: 'ayul' },
  { name: 'Duba-Yurt', nativeName: 'Duba-Yurt', lat: 43.0411, lng: 45.7331, type: 'ayul' },
  { name: 'Avtury', nativeName: 'Ebtura', lat: 43.14, lng: 46.01, type: 'ayul' },
  { name: 'Mesker-Yurt', nativeName: 'Mesker-Yurt', lat: 43.23, lng: 45.96, type: 'ayul' },
  { name: 'Starye Atagi', nativeName: 'Atagi-Kila', lat: 43.18, lng: 45.73, type: 'ayul' },
  { name: 'Novye Atagi', nativeName: 'Atagi-Kerla', lat: 43.14, lng: 45.79, type: 'ayul' },

  // Historical & Mountainous Areas
  { name: 'Vedeno', nativeName: 'Vedana', lat: 42.97, lng: 46.11, type: 'historical', description: 'Historical capital of Caucasian Imamate.' },
  { name: 'Shatoy', nativeName: 'Shuta', lat: 42.87, lng: 45.69, type: 'historical', description: 'Tower complex region.' },
  { name: 'Itum-Kali', nativeName: 'Iton-Khala', lat: 42.73, lng: 45.57, type: 'historical', description: 'Ancient towers and stone castles.' },
  { name: 'Nozhay-Yurt', nativeName: 'Naža-Yurt', lat: 43.09, lng: 46.38, type: 'historical' },
  { name: 'Achkhoy-Martan', nativeName: 'T\'ehl-Marta', lat: 43.2, lng: 45.28, type: 'historical' },
  { name: 'Sernovodskoye', nativeName: 'Ezher-Yurt', lat: 43.3, lng: 45.15, type: 'historical' },
  { name: 'Naurskaya', nativeName: 'Naur', lat: 43.65, lng: 45.45, type: 'historical' },
  { name: 'Shelkovskaya', nativeName: 'Merk-Yurt', lat: 43.51, lng: 46.33, type: 'historical' },
];

export const CHECHNYA_BORDER_POINTS: [number, number][] = [
  [43.85, 45.3], [44.0, 46.2], [43.6, 47.0], [43.2, 46.8], [42.8, 46.5], [42.4, 46.2], [42.4, 45.5], [42.8, 45.0], [43.2, 44.8], [43.6, 44.8]
];
