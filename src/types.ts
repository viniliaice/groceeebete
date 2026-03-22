export interface Product {
  id: string;
  name: string;
  price: number;
  icon: string;
  category: string;
  unit: string;
  stock: number;
  lowStock: number;
  description: string;
}

export interface NewProduct {
  name: string;
  price: number;
  icon: string;
  category: string;
  unit: string;
  stock: number;
  lowStock: number;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  icon: string;
  quantity: number;
  stock: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryLocation: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: 'cash' | 'telebirr';
  notes?: string;
  assignedDriver?: {
    name: string;
    phone: string;
  };
  createdAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'cancelled';

export type Page = 'shop' | 'cart' | 'checkout' | 'order-success' | 'my-orders' | 'admin';
