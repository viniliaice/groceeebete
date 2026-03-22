import { Product } from '../types';

export const initialProducts: Product[] = [
  // Grains & Staples
  { id: '1', name: 'Rice (Premium)', price: 2.49, icon: '🍚', category: 'Grains & Staples', unit: 'kg', stock: 100, lowStock: 10, description: 'Premium long grain white rice' },
  { id: '2', name: 'Basmati Rice', price: 3.99, icon: '🍚', category: 'Grains & Staples', unit: 'kg', stock: 50, lowStock: 10, description: 'Fragrant basmati rice' },
  { id: '3', name: 'Brown Rice', price: 2.99, icon: '🍚', category: 'Grains & Staples', unit: 'kg', stock: 40, lowStock: 10, description: 'Healthy brown rice' },
  { id: '4', name: 'Sugar', price: 1.29, icon: '🍬', category: 'Grains & Staples', unit: 'kg', stock: 80, lowStock: 15, description: 'Pure white sugar' },
  { id: '5', name: 'All-Purpose Flour', price: 1.49, icon: '🌾', category: 'Grains & Staples', unit: 'kg', stock: 120, lowStock: 20, description: 'Premium wheat flour' },
  { id: '6', name: 'Bread Flour', price: 1.79, icon: '🌾', category: 'Grains & Staples', unit: 'kg', stock: 60, lowStock: 10, description: 'High protein bread flour' },
  { id: '7', name: 'Pasta (Spaghetti)', price: 1.99, icon: '🍝', category: 'Grains & Staples', unit: 'pack', stock: 90, lowStock: 15, description: 'Italian spaghetti' },
  { id: '8', name: 'Pasta (Penne)', price: 1.89, icon: '🍝', category: 'Grains & Staples', unit: 'pack', stock: 75, lowStock: 15, description: 'Penne rigate pasta' },
  { id: '9', name: 'Oats', price: 2.49, icon: '🥣', category: 'Grains & Staples', unit: 'kg', stock: 45, lowStock: 10, description: 'Rolled oats for breakfast' },
  
  // Cooking Essentials
  { id: '10', name: 'Vegetable Oil', price: 3.99, icon: '🫒', category: 'Cooking Essentials', unit: 'L', stock: 70, lowStock: 15, description: 'Pure vegetable cooking oil' },
  { id: '11', name: 'Olive Oil', price: 6.99, icon: '🫒', category: 'Cooking Essentials', unit: '500ml', stock: 35, lowStock: 10, description: 'Extra virgin olive oil' },
  { id: '12', name: 'Sunflower Oil', price: 3.49, icon: '🌻', category: 'Cooking Essentials', unit: 'L', stock: 55, lowStock: 10, description: 'Light sunflower oil' },
  { id: '13', name: 'Salt', price: 0.79, icon: '🧂', category: 'Cooking Essentials', unit: 'kg', stock: 150, lowStock: 20, description: 'Table salt' },
  { id: '14', name: 'Black Pepper', price: 2.99, icon: '🌶️', category: 'Cooking Essentials', unit: '100g', stock: 40, lowStock: 8, description: 'Ground black pepper' },
  { id: '15', name: 'Butter', price: 3.49, icon: '🧈', category: 'Cooking Essentials', unit: '250g', stock: 30, lowStock: 10, description: 'Creamy butter' },
  { id: '16', name: 'Eggs', price: 4.99, icon: '🥚', category: 'Cooking Essentials', unit: 'dozen', stock: 45, lowStock: 10, description: 'Fresh farm eggs' },
  { id: '17', name: 'Milk', price: 1.49, icon: '🥛', category: 'Cooking Essentials', unit: 'L', stock: 60, lowStock: 15, description: 'Fresh whole milk' },
  
  // Beverages
  { id: '18', name: 'Coffee (Ground)', price: 5.99, icon: '☕', category: 'Beverages', unit: '250g', stock: 40, lowStock: 8, description: 'Premium ground coffee' },
  { id: '19', name: 'Tea Bags', price: 3.49, icon: '🍵', category: 'Beverages', unit: 'box', stock: 55, lowStock: 10, description: 'Black tea bags' },
  { id: '20', name: 'Orange Juice', price: 2.99, icon: '🍊', category: 'Beverages', unit: 'L', stock: 35, lowStock: 10, description: 'Fresh orange juice' },
  { id: '21', name: 'Bottled Water', price: 0.99, icon: '💧', category: 'Beverages', unit: 'L', stock: 200, lowStock: 30, description: 'Pure drinking water' },
  
  // Cleaning & Household
  { id: '22', name: 'Dish Soap', price: 2.49, icon: '🧴', category: 'Cleaning & Household', unit: '500ml', stock: 65, lowStock: 12, description: 'Liquid dish soap' },
  { id: '23', name: 'Laundry Detergent', price: 5.99, icon: '🧹', category: 'Cleaning & Household', unit: 'kg', stock: 50, lowStock: 10, description: 'Powder laundry detergent' },
  { id: '24', name: 'All-Purpose Cleaner', price: 3.49, icon: '🧴', category: 'Cleaning & Household', unit: '750ml', stock: 45, lowStock: 10, description: 'Multi-surface cleaner' },
  { id: '25', name: 'Sponges (3-Pack)', price: 1.99, icon: '🧽', category: 'Cleaning & Household', unit: 'pack', stock: 80, lowStock: 15, description: 'Kitchen sponges' },
  { id: '26', name: 'Toilet Paper (4-Pack)', price: 4.49, icon: '🧻', category: 'Cleaning & Household', unit: 'pack', stock: 70, lowStock: 12, description: 'Soft toilet paper' },
  { id: '27', name: 'Trash Bags', price: 3.99, icon: '🗑️', category: 'Cleaning & Household', unit: 'roll', stock: 90, lowStock: 15, description: 'Heavy duty trash bags' },
  
  // Personal Care
  { id: '28', name: 'Hand Soap', price: 2.29, icon: '🧼', category: 'Personal Care', unit: '250ml', stock: 60, lowStock: 12, description: 'Liquid hand soap' },
  { id: '29', name: 'Shampoo', price: 4.99, icon: '🧴', category: 'Personal Care', unit: '400ml', stock: 40, lowStock: 8, description: 'Gentle shampoo' },
  { id: '30', name: 'Toothpaste', price: 2.99, icon: '🪥', category: 'Personal Care', unit: 'tube', stock: 75, lowStock: 15, description: 'Fluoride toothpaste' },
  { id: '31', name: 'Body Wash', price: 4.49, icon: '🧴', category: 'Personal Care', unit: '500ml', stock: 50, lowStock: 10, description: 'Moisturizing body wash' },
];

export const categories = [
  'All',
  'Grains & Staples',
  'Cooking Essentials',
  'Beverages',
  'Cleaning & Household',
  'Personal Care',
];
