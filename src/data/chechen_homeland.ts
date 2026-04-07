export interface HomelandPoint {
  name: string;
  nativeName: string;
  lat: number;
  lng: number;
  type: 'city' | 'ayul' | 'historical';
  description?: string;
}

export const HOMELAND_POINTS: HomelandPoint[] = [
  // Основные города
  { name: 'Грозный', nativeName: 'Sölz-Gala', lat: 43.317, lng: 45.698, type: 'city', description: 'Столица Чеченской Республики.' },
  { name: 'Гудермес', nativeName: 'Gümse', lat: 43.35, lng: 46.1, type: 'city' },
  { name: 'Шали', nativeName: 'Shela', lat: 43.15, lng: 45.9, type: 'city' },
  { name: 'Урус-Мартан', nativeName: 'Halk-Marta', lat: 43.13, lng: 45.54, type: 'city' },
  { name: 'Аргун', nativeName: 'Ush-Gala', lat: 43.29, lng: 45.88, type: 'city' },
  { name: 'Курчалой', nativeName: 'Kuršloy-Gala', lat: 43.2, lng: 46.1, type: 'city' },

  // Аулы (Села)
  { name: 'Бамут', nativeName: 'Bamut', lat: 43.1633, lng: 45.2008, type: 'ayul', description: 'Легендарное село-крепость.' },
  { name: 'Самашки', nativeName: 'Samaški', lat: 43.2906, lng: 45.3000, type: 'ayul' },
  { name: 'Ачхой-Мартан', nativeName: 'T\'ehl-Marta', lat: 43.195, lng: 45.302, type: 'ayul' },
  { name: 'Гехи', nativeName: 'Gekhi', lat: 43.1633, lng: 45.4722, type: 'ayul' },
  { name: 'Старые Атаги', nativeName: 'Atagi-Kila', lat: 43.18, lng: 45.73, type: 'ayul' },
  { name: 'Автуры', nativeName: 'Ebtura', lat: 43.14, lng: 46.01, type: 'ayul' },
  { name: 'Цоцин-Юрт', nativeName: 'Cocin-Yurt', lat: 43.245, lng: 46.035, type: 'ayul' },

  // Юг и Горы (Исторические и Башенные комплексы)
  { name: 'Беной', nativeName: 'Benoy', lat: 42.9819, lng: 46.3069, type: 'historical', description: 'Родина тайпа Беной.' },
  { name: 'Ведено', nativeName: 'Vedana', lat: 42.97, lng: 46.11, type: 'historical', description: 'Историческая столица Кавказского Имамата.' },
  { name: 'Шатой', nativeName: 'Shuta', lat: 42.87, lng: 45.69, type: 'historical', description: 'Регион башенных комплексов.' },
  { name: 'Итум-Кали', nativeName: 'Iton-Khala', lat: 42.73, lng: 45.57, type: 'historical', description: 'Древние башни и каменные замки.' },
  { name: 'Кезеной-Ам', nativeName: 'Kezenoy-Am', lat: 42.7753, lng: 46.1539, type: 'historical', description: 'Жемчужина Кавказа, крупнейшее горное озеро.' },
  { name: 'Цой-Педе', nativeName: 'Cʼoy-Pʼede', lat: 42.7088, lng: 45.2530, type: 'historical', description: 'Город мертвых, один из крупнейших некрополей Кавказа.' },
  { name: 'Никарой', nativeName: 'Nikara', lat: 42.755, lng: 45.395, type: 'historical', description: 'Древний башенный комплекс в Аргунском ущелье.' },
  { name: 'Ушкалой', nativeName: 'Üshkalay', lat: 42.795, lng: 45.625, type: 'historical', description: 'Знаменитые башни-близнецы, встроенные в скалу.' },
  { name: 'Пхакоч', nativeName: 'Phakoč', lat: 42.729, lng: 45.575, type: 'historical', description: 'Средневековый башенный замок в Итум-Кали.' },
  { name: 'Хой', nativeName: 'Kkhoy', lat: 42.756, lng: 46.136, type: 'historical', description: 'Аул стражников у озера Кезеной-Ам.' },
  { name: 'Шарой', nativeName: 'Sharoy', lat: 42.635, lng: 45.805, type: 'historical' },
  { name: 'Галанчож', nativeName: 'Galanchozh', lat: 42.871, lng: 45.305, type: 'historical', description: 'Духовное сердце Нахского народа.' },

  // Север (Терек)
  { name: 'Наурская', nativeName: 'Naur', lat: 43.65, lng: 45.45, type: 'historical' },
  { name: 'Шелковская', nativeName: 'Merk-Yurt', lat: 43.51, lng: 46.33, type: 'historical' },
  { name: 'Знаменское', nativeName: 'Chulga-Yurt', lat: 43.680, lng: 45.130, type: 'historical' },
];

export const CHECHNYA_BORDER_POINTS: [number, number][] = [
  [43.85, 45.30], [44.02, 45.85], [44.05, 46.25], [43.65, 47.05], 
  [43.25, 46.90], [42.85, 46.60], [42.45, 46.35], [42.40, 45.95],
  [42.35, 45.50], [42.50, 45.15], [42.80, 44.95], [43.15, 44.75],
  [43.45, 44.70], [43.70, 44.90]
];
