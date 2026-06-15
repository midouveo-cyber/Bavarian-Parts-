export type ProductCondition = 'Neuf' | 'Occasion';

export type PartCategory = 
  | 'Carrosserie / Body'
  | 'Moteur / Engine'
  | 'Intérieur / Internal'
  | 'Tableau de bord / Dashboard'
  | 'Suspension / Suspension'
  | 'Éclairage / Lighting'
  | 'Accessoires & Autres';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // in Tunisian Dinars (TND)
  oemRef: string; // OEM part reference code
  image: string; // Image URL
  video?: string; // Optional Video URL (supports MP4 or YouTube)
  condition: ProductCondition;
  category: PartCategory;
  compatibility: string[]; // List of models e.g., ['E36', 'E46', 'E90', 'F30', 'A4', 'Golf']
  inStock: boolean;
  createdAt: string;
  // Opisto-style search properties
  brand: string;   // e.g., 'BMW', 'Audi', 'Peugeot'
  model: string;   // e.g., 'Série 3', 'A4', '208', 'Golf'
  year: number;    // e.g., 2012, 2018, 2024
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  city: string;
  deliveryMethod: 'louage' | 'pickup';
}

export interface AdminSettings {
  whatsappNumber: string; // WhatsApp Business number
  storeLocation: string; // Tunisian physically located area
  adminPassword?: string; // Customizable admin password (default: 'admin')
  backgroundImageUrl?: string; // Beautiful background image of BMWs
}

