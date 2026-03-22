import { useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, OrderStatus, OrderItem } from '../types';
import { initialProducts } from '../data/products';

// Local storage keys
const PRODUCTS_KEY = 'freshcart_products';
const ORDERS_KEY = 'freshcart_orders';

// Helper functions for localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export function useStore() {
  const [products, setProducts] = useState<Product[]>(() => 
    loadFromStorage(PRODUCTS_KEY, initialProducts)
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => 
    loadFromStorage(ORDERS_KEY, [])
  );
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Save to localStorage when products change
  useEffect(() => {
    saveToStorage(PRODUCTS_KEY, products);
  }, [products]);

  // Save to localStorage when orders change
  useEffect(() => {
    saveToStorage(ORDERS_KEY, orders);
  }, [orders]);

  // Cart functions
  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        // Check stock limit
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Order functions
  const placeOrder = useCallback(async (customerData: {
    name: string;
    phone: string;
    location: string;
    notes: string;
    paymentMethod: 'cash' | 'telebirr';
  }) => {
    const items: OrderItem[] = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      icon: item.product.icon,
      quantity: item.quantity,
      stock: item.product.stock,
    }));

    // Generate order ID
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();

    const newOrder: Order = {
      id: orderId,
      customerName: customerData.name,
      customerPhone: customerData.phone,
      deliveryLocation: customerData.location,
      items,
      total: getCartTotal(),
      status: 'pending',
      paymentMethod: customerData.paymentMethod,
      notes: customerData.notes,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();
    
    return orderId;
  }, [cart, getCartTotal, clearCart]);

  // Admin functions
  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, status };
      }
      return order;
    }));
  }, []);

  const updateOrderNotes = useCallback(async (orderId: string, notes: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, notes };
      }
      return order;
    }));
  }, []);

  const assignDriver = useCallback(async (orderId: string, driverName: string, driverPhone: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, assignedDriver: { name: driverName, phone: driverPhone } };
      }
      return order;
    }));
  }, []);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    const newId = 'PROD-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
    const newProduct: Product = { ...product, id: newId };
    setProducts(prev => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ));
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  }, []);

  const updateStock = useCallback(async (id: string, quantity: number) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, stock: Math.max(0, quantity) } : product
    ));
  }, []);

  // Get my orders by phone
  const getMyOrders = useCallback((phone: string) => {
    return orders.filter(order => order.customerPhone === phone);
  }, [orders]);

  // Get pending orders count for notifications
  const getPendingOrdersCount = useCallback(() => {
    return orders.filter(order => order.status === 'pending').length;
  }, [orders]);

  return {
    products,
    cart,
    orders,
    lastOrder,
    isLoading: false,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    placeOrder,
    updateOrderStatus,
    updateOrderNotes,
    assignDriver,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getMyOrders,
    getPendingOrdersCount,
  };
}
