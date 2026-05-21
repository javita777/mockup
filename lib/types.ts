export interface InventoryItem {
  id: string;
  cafe_id: string;
  name: string;
  unit: string;
  current_stock: number;
  minimum_stock: number;
  unit_cost: number;
  supplier?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  cafe_id: string;
  name: string;
  category: string;
  description?: string | null;
  price: number;
  cost: number;
  active: boolean;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  cafe_id: string;
  product_id: string;
  inventory_item_id: string;
  quantity: number;
  unit: string;
  created_at: string;
  inventory_items?: InventoryItem;
}

export interface Sale {
  id: string;
  cafe_id: string;
  total: number;
  payment_method: string;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export const CATEGORY_LABELS: Record<string, string> = {
  'bebidas-calientes': 'Bebidas Calientes',
  'bebidas-frias': 'Bebidas Frías',
  'comida': 'Comida',
  'postres': 'Postres',
};

export const CATEGORIES = [
  { id: 'bebidas-calientes', name: 'Bebidas Calientes' },
  { id: 'bebidas-frias', name: 'Bebidas Frías' },
  { id: 'comida', name: 'Comida' },
  { id: 'postres', name: 'Postres' },
];

export const UNITS = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'L', label: 'Litros (L)' },
  { value: 'pz', label: 'Piezas (pz)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'un', label: 'Unidades (un)' },
];
