import { Product, AdminSettings, PartCategory } from './types';

export const BRANDS = [
  'BMW'
];

export const MODELS_BY_BRAND: Record<string, string[]> = {
  'BMW': [
    'E30', 'E34', 'E36', 'E38', 'E39', 'E46', 'E53', 'E60', 'E63', 'E81', 'E82', 'E87', 'E90', 
    'E91', 'E92', 'E93', 'F10', 'F11', 'F20', 'F21', 'F22', 'F30', 'F31', 'F32', 'F36', 'F80', 
    'F82', 'G20', 'G21', 'G30', 'G31', 'G80', 'G82', 'X1', 'X3', 'X5', 'X6', 'M2', 'M3', 'M4', 'M5'
  ]
};

export const CHASSIS_LIST = [
  'E30', 'E34', 'E36', 'E38', 'E39', 'E46', 'E53', 'E60', 'E87', 'E90', 'E92', 'F10', 'F20', 'F30', 'F80', 'G20', 'G30'
];

export const CATEGORIES: PartCategory[] = [
  'Carrosserie / Body',
  'Moteur / Engine',
  'Intérieur / Internal',
  'Tableau de bord / Dashboard',
  'Suspension / Suspension',
  'Éclairage / Lighting',
  'Accessoires & Autres'
];

export const YEARS = Array.from({ length: 2026 - 1980 + 1 }, (_, i) => 2026 - i); // From 2026 down to 1980

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Volant M-Sport en Carbone Réel avec LED intelligent',
    description: 'Volant sport forgé en fibre de carbone véritable avec écran d\'affichage LED intégré indiquant le régime moteur (RPM) en temps réel, température d\'huile, niveau de charge et vitesse. Finition couture tri-couleur BMW M de haute précision, cuir perforé nappa sur les côtés. Un incontournable pour les passionnés de conduite sportive.',
    price: 2650,
    oemRef: 'BMW-M-LED-789',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1000',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-sports-car-steering-wheel-close-up-39932-large.mp4',
    condition: 'Neuf',
    category: 'Intérieur / Internal',
    compatibility: ['E90', 'E92', 'F30', 'F10', 'F20', 'F80'],
    inStock: true,
    createdAt: '2026-05-10T12:00:00Z',
    brand: 'BMW',
    model: 'F30',
    year: 2018
  },
  {
    id: 'prod-2',
    title: 'Phares Avant LED Angel Eyes Double Projecteur LCI Look',
    description: 'Paire d\'optiques de phares avant à LED haute puissance avec la technologie iconique d\'anneaux "Angel Eyes" 3D ultra-lumineux. Intègre un clignotant dynamique à balayage séquentiel et un faisceau directionnel parfait. Look moderne agressif assurant une excellente visibilité nocturne en Tunisie.',
    price: 1380,
    oemRef: 'BMW-AE-9092',
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1000',
    video: '',
    condition: 'Neuf',
    category: 'Éclairage / Lighting',
    compatibility: ['E90', 'E91', 'F30'],
    inStock: true,
    createdAt: '2026-05-15T14:30:00Z',
    brand: 'BMW',
    model: 'E90',
    year: 2012
  },
  {
    id: 'prod-3',
    title: 'Pare-choc Avant Complet Look M4 M-Performance',
    description: 'Kit de conversion pare-choc avant look M4 agressive, fabriqué en plastique polypropylène (PP) de qualité équivalente à l\'origine (OEM). Comprend la calandre double lignes noir laqué, les écopes d\'air inférieures de refroidissement, les caches antibrouillard, et l\'ensemble des supports d\'installation nécessaires.',
    price: 950,
    oemRef: 'BMW-PCM4-F30',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1000',
    video: '',
    condition: 'Neuf',
    category: 'Carrosserie / Body',
    compatibility: ['F30', 'F31'],
    inStock: true,
    createdAt: '2026-05-20T10:15:00Z',
    brand: 'BMW',
    model: 'F30',
    year: 2015
  },
  {
    id: 'prod-4',
    title: 'Capot Moteur d\'Origine - BMW Série 3 E46 Coupé',
    description: 'Capot moteur d\'origine pour BMW Série 3 E46 phase 2 (reconditionné). Teinte Titansilber constructeur d\'origine. Aucune rayure profonde ni de déformation. Prêt à être posé directement dans nos ateliers partenaires ou livré chez vous.',
    price: 490,
    oemRef: 'BMW-CAP-E46',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1000',
    video: '',
    condition: 'Occasion',
    category: 'Carrosserie / Body',
    compatibility: ['E46'],
    inStock: true,
    createdAt: '2026-05-22T16:45:00Z',
    brand: 'BMW',
    model: 'E46',
    year: 2004
  },
  {
    id: 'prod-5',
    title: 'Moteur Complet N47D20 2.0d reconditionné constructeur - E90 / F30',
    description: 'Bloc moteur complet révisé sous garantie pour BMW Série 3 (E90, F30) 2.0 Diesel. Comprenant la culasse inspectée, injecteurs injecteurs calibrés, turbocompresseur d\'origine et pompe à injection éprouvée. Kilométrage certifié : 110 000 km.',
    price: 4800,
    oemRef: 'BMW-MTR-N47D20',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=1000',
    video: '',
    condition: 'Occasion',
    category: 'Moteur / Engine',
    compatibility: ['E90', 'F30', 'F20', 'E87'],
    inStock: true,
    createdAt: '2026-05-25T09:00:00Z',
    brand: 'BMW',
    model: 'E90',
    year: 2011
  },
  {
    id: 'prod-6',
    title: 'Tableau de bord Complet avec Airbag - BMW E60 LCI',
    description: 'Ensemble console centrale et planche de bord complète pour BMW E60 phase 2 (modèles LCI). Inclut le module airbag passager non déclenché, les ouïes d\'aération de luxe et le faisceau électrique principal en parfait état.',
    price: 1350,
    oemRef: 'BMW-TDB-E60',
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1000',
    video: '',
    condition: 'Occasion',
    category: 'Tableau de bord / Dashboard',
    compatibility: ['E60', 'E61'],
    inStock: true,
    createdAt: '2026-06-01T11:00:00Z',
    brand: 'BMW',
    model: 'E60',
    year: 2008
  },
  {
    id: 'prod-7',
    title: 'Amortisseurs Filetés Réglables Sport de Haute Précision - BMW E36/E46',
    description: 'Kit de 4 combinés filetés réglables en hauteur et fermeté. Optimise drastiquement le comportement routier et la tenue de cap à haute vitesse. Fabriqué en acier inoxydable haute résistance.',
    price: 1120,
    oemRef: 'SPRT-SUSP-BMW',
    image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80&w=1000',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-car-wheel-turning-close-up-39933-large.mp4',
    condition: 'Neuf',
    category: 'Suspension / Suspension',
    compatibility: ['E36', 'E46', 'Z3'],
    inStock: true,
    createdAt: '2026-06-02T15:20:00Z',
    brand: 'BMW',
    model: 'E36',
    year: 1998
  },
  {
    id: 'prod-8',
    title: 'Bouton de Démarrage Rouge M-Button Sport',
    description: 'Une touche esthétique subtile et authentique inspirée de l\'univers de la course M-Sport. Bouton de démarrage moteur de couleur rouge brillant résistant aux rayures. S\'installe facilement en quelques minutes à la place de votre bouton usé d\'origine.',
    price: 45,
    oemRef: 'BMW-BTN-RED',
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=1000',
    video: '',
    condition: 'Neuf',
    category: 'Tableau de bord / Dashboard',
    compatibility: ['E90', 'E92', 'F30', 'F10', 'F20'],
    inStock: true,
    createdAt: '2026-06-05T08:10:00Z',
    brand: 'BMW',
    model: 'E90',
    year: 2010
  }
];

const STORAGE_KEYS = {
  PRODUCTS: 'opisto_style_products_v2', // Updated to v2 so it resets cleanly to 100% BMW content
  SETTINGS: 'opisto_style_settings_v2'
};

export const getSavedProducts = (): Product[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  try {
    const parsed = JSON.parse(data);
    return parsed.map((p: any) => ({
      ...p,
      brand: 'BMW', // Force brand to be BMW
      model: p.model || 'E46',
      year: p.year || 2012
    }));
  } catch (e) {
    return DEFAULT_PRODUCTS;
  }
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getSavedSettings = (): AdminSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  const defaultSettings: AdminSettings = {
    whatsappNumber: '0021627616114', 
    storeLocation: 'Sousse, Tunisia',
    adminPassword: 'admin',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=1920' // A beautiful blue and white/dark M3 BMW road shot
  };
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    return defaultSettings;
  }
  try {
    const parsed = JSON.parse(data);
    if (!parsed.adminPassword) {
      parsed.adminPassword = 'admin';
    }
    if (!parsed.backgroundImageUrl) {
      parsed.backgroundImageUrl = defaultSettings.backgroundImageUrl;
    }
    // Update legacy background, whatsapp alignment or location
    if (parsed.whatsappNumber === '+21699123456' || !parsed.whatsappNumber || parsed.whatsappNumber === '27616114') {
      parsed.whatsappNumber = '0021627616114';
      parsed.storeLocation = 'Sousse, Tunisia';
    }
    return parsed;
  } catch (e) {
    return defaultSettings;
  }
};

export const saveSettings = (settings: AdminSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};
