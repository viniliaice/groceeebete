import { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutPageProps {
  cart: CartItem[];
  cartTotal: number;
  onPlaceOrder: (customerData: {
    name: string;
    phone: string;
    location: string;
    notes: string;
    paymentMethod: 'cash' | 'telebirr';
  }) => void;
  onBack: () => void;
}

export function CheckoutPage({ cart, cartTotal, onPlaceOrder, onBack }: CheckoutPageProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'telebirr'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryFee = cartTotal >= 50 ? 0 : 3.99;
  const totalWithDelivery = cartTotal + deliveryFee;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{9,}$/.test(phone.replace(/[\s\-()]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!location.trim()) {
      newErrors.location = 'Delivery location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate a short delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onPlaceOrder({
      name: name.trim(),
      phone: phone.trim(),
      location: location.trim(),
      notes: notes.trim(),
      paymentMethod,
    });
  };

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
        <h1 className="text-xl font-bold text-gray-800">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Delivery Information */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">📍</span> Delivery Information
          </h2>
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <div className="flex">
                <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600">
                  +1
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="555-0123"
                  className={`flex-1 px-4 py-3 rounded-r-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Delivery Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address *
              </label>
              <textarea
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your full delivery address..."
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border ${errors.location ? 'border-red-500' : 'border-gray-200'} focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition resize-none`}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Gate code, landmark, etc."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">💳</span> Payment Method
          </h2>
          
          <div className="space-y-3">
            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
              paymentMethod === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
                className="w-5 h-5 text-green-600"
              />
              <span className="text-2xl">💵</span>
              <div>
                <p className="font-medium text-gray-800">Cash on Delivery</p>
                <p className="text-xs text-gray-500">Pay when you receive your order</p>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
              paymentMethod === 'telebirr' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="payment"
                value="telebirr"
                checked={paymentMethod === 'telebirr'}
                onChange={() => setPaymentMethod('telebirr')}
                className="w-5 h-5 text-green-600"
              />
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-medium text-gray-800">Mobile Payment</p>
                <p className="text-xs text-gray-500">Telebirr or similar services</p>
              </div>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
          
          {/* Items */}
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.product.icon} {item.product.name} x{item.quantity}
                </span>
                <span className="text-gray-800 font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 space-y-2 text-sm">
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
            <div className="border-t pt-2 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span className="text-green-600 text-lg">${totalWithDelivery.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Placing Order...
            </span>
          ) : (
            'Place Order 🛒'
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          By placing this order, you agree to receive a confirmation call from our team.
        </p>
      </form>
    </div>
  );
}
