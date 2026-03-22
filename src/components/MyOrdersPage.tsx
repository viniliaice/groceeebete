import { useState } from 'react';
import { Order, OrderStatus } from '../types';

interface MyOrdersPageProps {
  orders: Order[];
  onBack: () => void;
}

export function MyOrdersPage({ orders, onBack }: MyOrdersPageProps) {
  const [phone, setPhone] = useState('');
  const [searchedPhone, setSearchedPhone] = useState('');
  const [viewMode, setViewMode] = useState<'search' | 'results'>('search');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      setSearchedPhone(phone.trim());
      setViewMode('results');
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customerPhone.includes(searchedPhone)
  );

  if (viewMode === 'search') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl hover:bg-gray-200 transition"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center mb-6">
            <span className="text-5xl mb-4 block">📦</span>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Track Your Orders</h2>
            <p className="text-gray-500 text-sm">Enter your phone number to view order history</p>
          </div>

          <form onSubmit={handleSearch}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
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
                  className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition active:scale-95"
            >
              View Orders
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setViewMode('search')}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl hover:bg-gray-200 transition"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
          <p className="text-sm text-gray-500">+1 {searchedPhone}</p>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <span className="text-5xl mb-4 block">📭</span>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">No orders found</h2>
          <p className="text-gray-500 text-sm mb-6">
            No orders found for this phone number
          </p>
          <button
            onClick={onBack}
            className="bg-green-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-700 transition"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const getStatusSteps = (status: OrderStatus) => {
    const steps = [
      { key: 'pending', label: 'Placed', icon: '📝' },
      { key: 'confirmed', label: 'Confirmed', icon: '✅' },
      { key: 'out_for_delivery', label: 'On the way', icon: '🚚' },
      { key: 'delivered', label: 'Delivered', icon: '📦' },
    ];

    const statusIndex = status === 'cancelled' ? -1 :
      status === 'pending' ? 0 :
      status === 'confirmed' ? 1 :
      status === 'out_for_delivery' ? 2 : 3;

    return steps.map((step, index) => ({
      ...step,
      completed: statusIndex >= index,
      current: statusIndex === index,
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusSteps = getStatusSteps(order.status);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Progress Tracker */}
      {order.status !== 'cancelled' && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 ${
                  step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <span className={`text-xs ${step.completed ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                  {step.label}
                </span>
                {index < statusSteps.length - 1 && (
                  <div className={`absolute h-0.5 w-full ${step.completed ? 'bg-green-300' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
          <p className="text-red-700 text-sm font-medium">❌ Order was cancelled</p>
        </div>
      )}

      {/* Items */}
      <div className="border-t pt-3 mb-3">
        <div className="space-y-1">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.icon} {item.name} x{item.quantity}</span>
              <span className="text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-xs text-gray-500">+{order.items.length - 3} more items</p>
          )}
        </div>
      </div>

      {/* Total & Driver */}
      <div className="flex items-center justify-between border-t pt-3">
        <div>
          <p className="text-lg font-bold text-green-600">${order.total.toFixed(2)}</p>
          <p className="text-xs text-gray-500">
            {order.paymentMethod === 'cash' ? '💵 Cash on Delivery' : '📱 Mobile Payment'}
          </p>
        </div>
        {order.assignedDriver && order.status === 'out_for_delivery' && (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">🚗 {order.assignedDriver.name}</p>
            <p className="text-xs text-gray-500">Driver</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<OrderStatus, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '⏳ Pending' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: '✅ Confirmed' },
    out_for_delivery: { bg: 'bg-purple-100', text: 'text-purple-700', label: '🚚 On the way' },
    delivered: { bg: 'bg-green-100', text: 'text-green-700', label: '✓ Delivered' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: '✗ Cancelled' },
  };

  const { bg, text, label } = config[status];

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}
