import { Order } from '../types';

interface OrderSuccessPageProps {
  order: Order | null;
  onContinueShopping: () => void;
  onViewOrders: () => void;
}

export function OrderSuccessPage({ order, onContinueShopping, onViewOrders }: OrderSuccessPageProps) {
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <span className="text-6xl mb-4 block">❓</span>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No order found</h2>
        <button
          onClick={onContinueShopping}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        {/* Success Animation */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">✅</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600">Thank you for your order, {order.customerName}!</p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Order Details</h2>
          <span className="text-sm text-gray-500">#{order.id.slice(0, 8).toUpperCase()}</span>
        </div>

        {/* Status */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📞</span>
            <div>
              <p className="font-medium text-yellow-800">Awaiting Confirmation</p>
              <p className="text-sm text-yellow-700">
                Our team will call you at <strong>+1 {order.customerPhone}</strong> to confirm your order.
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Items Ordered:</h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.icon} {item.name} x{item.quantity}</span>
                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-green-600">${order.total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Payment: {order.paymentMethod === 'cash' ? '💵 Cash on Delivery' : '📱 Mobile Payment'}
          </p>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>📍</span> Delivery Address
        </h3>
        <p className="text-gray-600 text-sm">{order.deliveryLocation}</p>
        {order.notes && (
          <p className="text-gray-500 text-xs mt-2">Note: {order.notes}</p>
        )}
      </div>

      {/* What's Next */}
      <div className="bg-blue-50 rounded-2xl p-5 mb-6">
        <h3 className="font-semibold text-blue-800 mb-3">What happens next?</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-700 flex-shrink-0">1</span>
            <p className="text-sm text-blue-800">Our team will call you to confirm your order</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-700 flex-shrink-0">2</span>
            <p className="text-sm text-blue-800">Your order will be prepared and assigned to a driver</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold text-blue-700 flex-shrink-0">3</span>
            <p className="text-sm text-blue-800">Delivery to your doorstep - pay on delivery!</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onContinueShopping}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition active:scale-95"
        >
          Continue Shopping
        </button>
        <button
          onClick={onViewOrders}
          className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}
