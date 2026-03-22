import { CartItem } from '../types';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  cartTotal: number;
  onCheckout: () => void;
  onBack: () => void;
}

export function CartPage({ cart, onUpdateQuantity, onRemoveItem, cartTotal, onCheckout, onBack }: CartPageProps) {
  const deliveryFee = cartTotal >= 50 ? 0 : 3.99;
  const totalWithDelivery = cartTotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <span className="text-6xl mb-4 block">🛒</span>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <button
            onClick={onBack}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl hover:bg-gray-200 transition"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-800">Shopping Cart</h1>
        <span className="text-gray-500">({cart.length} items)</span>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.map(item => (
          <CartItemCard
            key={item.product.id}
            item={item}
            onUpdateQuantity={(qty) => onUpdateQuantity(item.product.id, qty)}
            onRemove={() => onRemoveItem(item.product.id)}
          />
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            {deliveryFee === 0 ? (
              <span className="text-green-600 font-medium">FREE</span>
            ) : (
              <span>${deliveryFee.toFixed(2)}</span>
            )}
          </div>
          {cartTotal < 50 && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-xs">
              Add ${(50 - cartTotal).toFixed(2)} more for free delivery! 🚚
            </div>
          )}
          <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
            <span>Total</span>
            <span className="text-green-600">${totalWithDelivery.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition active:scale-95"
      >
        Proceed to Checkout →
      </button>
    </div>
  );
}

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const { product, quantity } = item;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex gap-4">
        {/* Product Icon */}
        <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-3xl">{product.icon}</span>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-sm mb-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-2">${product.price.toFixed(2)} / {product.unit}</p>
          
          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(quantity - 1)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-200 transition"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => quantity < product.stock && onUpdateQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
                className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-lg font-bold text-white hover:bg-green-700 transition disabled:opacity-50"
              >
                +
              </button>
            </div>

            {/* Price & Remove */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-green-600">${(product.price * quantity).toFixed(2)}</span>
              <button
                onClick={onRemove}
                className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 transition"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
