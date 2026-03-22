import { useState, useMemo } from 'react';
import { Product, CartItem } from '../types';
import { categories } from '../data/products';

interface ShopPageProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  isLoading: boolean;
}

export function ShopPage({ products, cart, onAddToCart, onUpdateQuantity, isLoading }: ShopPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const getCartQuantity = (productId: string) => {
    const item = cart.find(c => c.product.id === productId);
    return item?.quantity || 0;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🛒</div>
            <p className="text-gray-500">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 md:p-8 mb-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to FreshCart 🛒</h1>
        <p className="text-green-100 mb-4">Your local grocery delivery - fast & fresh!</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">✓ Free delivery over $50</span>
          <span className="bg-white/20 px-3 py-1 rounded-full">✓ Cash on delivery</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition ${
              selectedCategory === category
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl mb-4 block">🔍</span>
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              cartQuantity={getCartQuantity(product.id)}
              onAddToCart={() => onAddToCart(product)}
              onUpdateQuantity={(qty) => onUpdateQuantity(product.id, qty)}
            />
          ))}
        </div>
      )}

      {/* Floating Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:max-w-lg bg-green-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between z-40">
          <div>
            <span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
            <span className="mx-2">•</span>
            <span className="font-bold">${cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}</span>
          </div>
          <button 
            onClick={() => window.location.hash = 'cart'}
            className="bg-white text-green-600 px-4 py-1.5 rounded-full font-semibold hover:bg-green-50 transition"
          >
            View Cart →
          </button>
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

function ProductCard({ product, cartQuantity, onAddToCart, onUpdateQuantity }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStock;

  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden transition hover:shadow-md ${isOutOfStock ? 'opacity-60' : ''}`}>
      {/* Product Image/Icon */}
      <div className="relative bg-gray-50 p-4 flex items-center justify-center h-28">
        <span className="text-5xl">{product.icon}</span>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              OUT OF STOCK
            </span>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded">
            {product.stock} left
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-400">/{product.unit}</span>
        </div>

        {/* Add to Cart / Quantity Controls */}
        {isOutOfStock ? (
          <button
            disabled
            className="w-full py-2 bg-gray-200 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
          >
            Unavailable
          </button>
        ) : cartQuantity > 0 ? (
          <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onUpdateQuantity(cartQuantity - 1)}
              className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm"
            >
              −
            </button>
            <span className="font-semibold text-gray-800">{cartQuantity}</span>
            <button
              onClick={() => cartQuantity < product.stock && onUpdateQuantity(cartQuantity + 1)}
              disabled={cartQuantity >= product.stock}
              className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center text-lg font-bold text-white hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={onAddToCart}
            className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition active:scale-95"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
