// Mock data for TuCafetería

export interface Product {
  id: string;
  name: string;
  category: 'bebidas-calientes' | 'bebidas-frias' | 'comida' | 'postres';
  price: number;
  cost: number;
  image: string;
  active: boolean;
  variants?: { name: string; priceModifier: number }[];
  customizations?: { name: string; options: { name: string; price: number }[] }[];
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPerUnit: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  loyaltyPoints: number;
  totalSpent: number;
  lastVisit: string;
  favoriteProduct: string;
}

export interface Sale {
  id: string;
  date: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  customerId?: string;
  paymentMethod: 'efectivo' | 'tarjeta' | 'transferencia';
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  shift: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: 'apertura' | 'cierre' | 'general';
}

// Products
export const products: Product[] = [
  {
    id: '1',
    name: 'Latte',
    category: 'bebidas-calientes',
    price: 55,
    cost: 18,
    image: '/products/latte.jpg',
    active: true,
    variants: [
      { name: 'Chico', priceModifier: -10 },
      { name: 'Mediano', priceModifier: 0 },
      { name: 'Grande', priceModifier: 15 },
    ],
    customizations: [
      {
        name: 'Leche',
        options: [
          { name: 'Entera', price: 0 },
          { name: 'Deslactosada', price: 5 },
          { name: 'Almendra', price: 12 },
          { name: 'Avena', price: 12 },
        ],
      },
      {
        name: 'Extra',
        options: [
          { name: 'Shot extra', price: 10 },
          { name: 'Jarabe vainilla', price: 8 },
          { name: 'Jarabe caramelo', price: 8 },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Cappuccino',
    category: 'bebidas-calientes',
    price: 52,
    cost: 16,
    image: '/products/cappuccino.jpg',
    active: true,
    variants: [
      { name: 'Chico', priceModifier: -8 },
      { name: 'Mediano', priceModifier: 0 },
      { name: 'Grande', priceModifier: 12 },
    ],
  },
  {
    id: '3',
    name: 'Americano',
    category: 'bebidas-calientes',
    price: 38,
    cost: 10,
    image: '/products/americano.jpg',
    active: true,
    variants: [
      { name: 'Chico', priceModifier: -5 },
      { name: 'Mediano', priceModifier: 0 },
      { name: 'Grande', priceModifier: 8 },
    ],
  },
  {
    id: '4',
    name: 'Espresso',
    category: 'bebidas-calientes',
    price: 32,
    cost: 8,
    image: '/products/espresso.jpg',
    active: true,
    variants: [
      { name: 'Simple', priceModifier: 0 },
      { name: 'Doble', priceModifier: 12 },
    ],
  },
  {
    id: '5',
    name: 'Mocha',
    category: 'bebidas-calientes',
    price: 62,
    cost: 22,
    image: '/products/mocha.jpg',
    active: true,
    variants: [
      { name: 'Chico', priceModifier: -10 },
      { name: 'Mediano', priceModifier: 0 },
      { name: 'Grande', priceModifier: 15 },
    ],
  },
  {
    id: '6',
    name: 'Frappé de Café',
    category: 'bebidas-frias',
    price: 68,
    cost: 25,
    image: '/products/frappe.jpg',
    active: true,
    variants: [
      { name: 'Mediano', priceModifier: 0 },
      { name: 'Grande', priceModifier: 18 },
    ],
  },
  {
    id: '7',
    name: 'Cold Brew',
    category: 'bebidas-frias',
    price: 58,
    cost: 20,
    image: '/products/coldbrew.jpg',
    active: true,
  },
  {
    id: '8',
    name: 'Té Chai Latte',
    category: 'bebidas-calientes',
    price: 55,
    cost: 18,
    image: '/products/chai.jpg',
    active: true,
  },
  {
    id: '9',
    name: 'Croissant',
    category: 'comida',
    price: 45,
    cost: 15,
    image: '/products/croissant.jpg',
    active: true,
  },
  {
    id: '10',
    name: 'Sandwich Jamón y Queso',
    category: 'comida',
    price: 75,
    cost: 30,
    image: '/products/sandwich.jpg',
    active: true,
  },
  {
    id: '11',
    name: 'Panini Caprese',
    category: 'comida',
    price: 85,
    cost: 35,
    image: '/products/panini.jpg',
    active: true,
  },
  {
    id: '12',
    name: 'Brownie',
    category: 'postres',
    price: 48,
    cost: 18,
    image: '/products/brownie.jpg',
    active: true,
  },
  {
    id: '13',
    name: 'Cheesecake',
    category: 'postres',
    price: 65,
    cost: 28,
    image: '/products/cheesecake.jpg',
    active: false,
  },
  {
    id: '14',
    name: 'Galleta Chocolate',
    category: 'postres',
    price: 28,
    cost: 10,
    image: '/products/cookie.jpg',
    active: true,
  },
];

// Ingredients
export const ingredients: Ingredient[] = [
  { id: '1', name: 'Café en grano', unit: 'kg', currentStock: 8, minStock: 5, maxStock: 25, costPerUnit: 280 },
  { id: '2', name: 'Leche entera', unit: 'L', currentStock: 12, minStock: 10, maxStock: 40, costPerUnit: 28 },
  { id: '3', name: 'Leche deslactosada', unit: 'L', currentStock: 4, minStock: 5, maxStock: 20, costPerUnit: 32 },
  { id: '4', name: 'Leche de almendra', unit: 'L', currentStock: 2, minStock: 3, maxStock: 12, costPerUnit: 65 },
  { id: '5', name: 'Leche de avena', unit: 'L', currentStock: 3, minStock: 3, maxStock: 12, costPerUnit: 58 },
  { id: '6', name: 'Azúcar', unit: 'kg', currentStock: 5, minStock: 3, maxStock: 15, costPerUnit: 35 },
  { id: '7', name: 'Chocolate en polvo', unit: 'kg', currentStock: 1.5, minStock: 2, maxStock: 8, costPerUnit: 180 },
  { id: '8', name: 'Jarabe de vainilla', unit: 'L', currentStock: 2, minStock: 1, maxStock: 6, costPerUnit: 145 },
  { id: '9', name: 'Jarabe de caramelo', unit: 'L', currentStock: 1.8, minStock: 1, maxStock: 6, costPerUnit: 145 },
  { id: '10', name: 'Crema batida', unit: 'L', currentStock: 3, minStock: 2, maxStock: 10, costPerUnit: 95 },
  { id: '11', name: 'Croissants', unit: 'pz', currentStock: 8, minStock: 10, maxStock: 30, costPerUnit: 15 },
  { id: '12', name: 'Pan para sandwich', unit: 'pz', currentStock: 15, minStock: 10, maxStock: 40, costPerUnit: 8 },
  { id: '13', name: 'Jamón', unit: 'kg', currentStock: 1.2, minStock: 1, maxStock: 5, costPerUnit: 180 },
  { id: '14', name: 'Queso manchego', unit: 'kg', currentStock: 0.8, minStock: 1, maxStock: 4, costPerUnit: 220 },
  { id: '15', name: 'Brownies', unit: 'pz', currentStock: 6, minStock: 8, maxStock: 20, costPerUnit: 18 },
];

// Customers
export const customers: Customer[] = [
  { id: '1', name: 'María García', email: 'maria.g@email.com', phone: '55-1234-5678', visits: 45, loyaltyPoints: 450, totalSpent: 4850, lastVisit: '2024-01-15', favoriteProduct: 'Latte' },
  { id: '2', name: 'Carlos López', email: 'carlos.l@email.com', phone: '55-2345-6789', visits: 32, loyaltyPoints: 320, totalSpent: 3420, lastVisit: '2024-01-14', favoriteProduct: 'Cappuccino' },
  { id: '3', name: 'Ana Martínez', email: 'ana.m@email.com', phone: '55-3456-7890', visits: 28, loyaltyPoints: 280, totalSpent: 2980, lastVisit: '2024-01-15', favoriteProduct: 'Cold Brew' },
  { id: '4', name: 'Roberto Sánchez', email: 'roberto.s@email.com', phone: '55-4567-8901', visits: 52, loyaltyPoints: 520, totalSpent: 5650, lastVisit: '2024-01-13', favoriteProduct: 'Americano' },
  { id: '5', name: 'Laura Hernández', email: 'laura.h@email.com', phone: '55-5678-9012', visits: 18, loyaltyPoints: 180, totalSpent: 1920, lastVisit: '2024-01-12', favoriteProduct: 'Mocha' },
  { id: '6', name: 'Diego Ramírez', email: 'diego.r@email.com', phone: '55-6789-0123', visits: 67, loyaltyPoints: 670, totalSpent: 7250, lastVisit: '2024-01-15', favoriteProduct: 'Espresso' },
  { id: '7', name: 'Patricia Torres', email: 'patricia.t@email.com', phone: '55-7890-1234', visits: 23, loyaltyPoints: 230, totalSpent: 2480, lastVisit: '2024-01-11', favoriteProduct: 'Té Chai Latte' },
  { id: '8', name: 'Fernando Díaz', email: 'fernando.d@email.com', phone: '55-8901-2345', visits: 41, loyaltyPoints: 410, totalSpent: 4420, lastVisit: '2024-01-14', favoriteProduct: 'Frappé de Café' },
];

// Sales data for charts
export const salesByDay = [
  { day: 'Lun', ventas: 4250, ordenes: 78 },
  { day: 'Mar', ventas: 3890, ordenes: 72 },
  { day: 'Mie', ventas: 4520, ordenes: 85 },
  { day: 'Jue', ventas: 4180, ordenes: 79 },
  { day: 'Vie', ventas: 5340, ordenes: 98 },
  { day: 'Sab', ventas: 6120, ordenes: 112 },
  { day: 'Dom', ventas: 5680, ordenes: 104 },
];

export const salesByCategory = [
  { category: 'Bebidas Calientes', value: 45, amount: 15200 },
  { category: 'Bebidas Frías', value: 25, amount: 8400 },
  { category: 'Comida', value: 20, amount: 6750 },
  { category: 'Postres', value: 10, amount: 3380 },
];

export const topProducts = [
  { name: 'Latte', sold: 156, revenue: 8580 },
  { name: 'Cappuccino', sold: 132, revenue: 6864 },
  { name: 'Americano', sold: 98, revenue: 3724 },
  { name: 'Croissant', sold: 87, revenue: 3915 },
  { name: 'Cold Brew', sold: 76, revenue: 4408 },
];

// Staff
export const staff: Staff[] = [
  { id: '1', name: 'Andrea López', role: 'Barista', shift: '7:00 - 15:00', avatar: 'AL' },
  { id: '2', name: 'Miguel Ruiz', role: 'Barista', shift: '15:00 - 22:00', avatar: 'MR' },
  { id: '3', name: 'Sofía Chen', role: 'Cajera', shift: '8:00 - 16:00', avatar: 'SC' },
  { id: '4', name: 'David Morales', role: 'Gerente', shift: '9:00 - 18:00', avatar: 'DM' },
];

// Tasks
export const tasks: Task[] = [
  { id: '1', title: 'Encender máquina de espresso', completed: true, category: 'apertura' },
  { id: '2', title: 'Verificar stock de leche', completed: true, category: 'apertura' },
  { id: '3', title: 'Preparar vitrina de postres', completed: false, category: 'apertura' },
  { id: '4', title: 'Revisar caja registradora', completed: true, category: 'apertura' },
  { id: '5', title: 'Limpiar mesas', completed: false, category: 'general' },
  { id: '6', title: 'Reponer servilletas', completed: true, category: 'general' },
  { id: '7', title: 'Limpiar máquina de espresso', completed: false, category: 'cierre' },
  { id: '8', title: 'Cerrar caja', completed: false, category: 'cierre' },
  { id: '9', title: 'Refrigerar productos perecederos', completed: false, category: 'cierre' },
];

// Alerts
export const alerts = [
  { id: '1', type: 'warning' as const, message: 'Stock bajo: Croissants (8 unidades)', time: 'Hace 2h' },
  { id: '2', type: 'warning' as const, message: 'Stock bajo: Chocolate en polvo', time: 'Hace 3h' },
  { id: '3', type: 'danger' as const, message: 'Leche de almendra por agotarse', time: 'Hace 5h' },
  { id: '4', type: 'info' as const, message: 'Diego Ramírez alcanzó 600 puntos', time: 'Ayer' },
];

// Today's summary
export const todaySummary = {
  revenue: 4850,
  orders: 89,
  customers: 72,
  averageTicket: 54.5,
  comparedToYesterday: {
    revenue: 12,
    orders: 8,
    customers: 5,
  },
};

// Recent sales
export const recentSales: Sale[] = [
  {
    id: '1',
    date: '2024-01-15T14:32:00',
    items: [
      { productId: '1', productName: 'Latte Grande', quantity: 1, price: 70 },
      { productId: '9', productName: 'Croissant', quantity: 1, price: 45 },
    ],
    total: 115,
    customerId: '1',
    paymentMethod: 'tarjeta',
  },
  {
    id: '2',
    date: '2024-01-15T14:15:00',
    items: [
      { productId: '3', productName: 'Americano Mediano', quantity: 2, price: 76 },
    ],
    total: 76,
    paymentMethod: 'efectivo',
  },
  {
    id: '3',
    date: '2024-01-15T13:58:00',
    items: [
      { productId: '5', productName: 'Mocha Grande', quantity: 1, price: 77 },
      { productId: '12', productName: 'Brownie', quantity: 2, price: 96 },
    ],
    total: 173,
    customerId: '3',
    paymentMethod: 'tarjeta',
  },
];

export const categoryLabels: Record<Product['category'], string> = {
  'bebidas-calientes': 'Bebidas Calientes',
  'bebidas-frias': 'Bebidas Frías',
  'comida': 'Comida',
  'postres': 'Postres',
};
