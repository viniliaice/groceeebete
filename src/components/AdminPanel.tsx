import { useState } from 'react';
import { Product, Order, OrderStatus, NewProduct } from '../types';
import { categories } from '../data/products';

const productIcons = ['🍚', '🍬', '🌾', '🍝', '🥣', '🫒', '🌻', '🧂', '🌶️', '🧈', '🥚', '🥛', '☕', '🍵', '🍊', '💧', '🧴', '🧹', '🧽', '🧻', '🗑️', '🧼', '🪥', '🍎', '🥦', '🧀', '🍞', '🥩', '🍗', '🍫'];

interface AdminPanelProps {
  orders: Order[];
  products: Product[];
  lowStockProducts: Product[];
  outOfStockProducts: Product[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateNotes: (orderId: string, notes: string) => void;
  onAssignDriver: (orderId: string, driverName: string) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateStock: (id: string, quantity: number) => void;
}

type AdminTab = 'orders' | 'products' | 'stock';

export function AdminPanel({
  orders,
  products,
  lowStockProducts,
  outOfStockProducts,
  onUpdateStatus,
  onUpdateNotes,
  onAssignDriver,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateStock,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    activeOrders: orders.filter(o => ['confirmed', 'out_for_delivery'].includes(o.status)).length,
    totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Manage orders and inventory</p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-red-500 text-white px-4 py-2 rounded-full font-medium animate-pulse">
            🔔 {pendingCount} new order{pendingCount > 1 ? 's' : ''}!
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 shadow-sm">
          <p className="text-yellow-700 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{stats.pendingOrders}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow-sm">
          <p className="text-blue-700 text-sm">Active</p>
          <p className="text-2xl font-bold text-blue-700">{stats.activeOrders}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow-sm">
          <p className="text-green-700 text-sm">Revenue</p>
          <p className="text-2xl font-bold text-green-700">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
            activeTab === 'orders' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📦 Orders
          {pendingCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition ${
            activeTab === 'products' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏷️ Products
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition flex items-center gap-2 ${
            activeTab === 'stock' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📊 Stock
          {outOfStockProducts.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{outOfStockProducts.length}</span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'orders' && (
        <OrdersTab
          orders={filteredOrders}
          statusFilter={statusFilter}
          expandedOrder={expandedOrder}
          onStatusFilterChange={setStatusFilter}
          onToggleExpand={(id) => setExpandedOrder(expandedOrder === id ? null : id)}
          onUpdateStatus={onUpdateStatus}
          onUpdateNotes={onUpdateNotes}
          onAssignDriver={onAssignDriver}
        />
      )}
      {activeTab === 'products' && (
        <ProductsTab
          products={products}
          onAddProduct={onAddProduct}
          onUpdateProduct={onUpdateProduct}
          onDeleteProduct={onDeleteProduct}
        />
      )}
      {activeTab === 'stock' && (
        <StockTab
          products={products}
          lowStockProducts={lowStockProducts}
          outOfStockProducts={outOfStockProducts}
          onUpdateStock={onUpdateStock}
        />
      )}
    </div>
  );
}

// Orders Tab Component
interface OrdersTabProps {
  orders: Order[];
  statusFilter: OrderStatus | 'all';
  expandedOrder: string | null;
  onStatusFilterChange: (filter: OrderStatus | 'all') => void;
  onToggleExpand: (id: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateNotes: (orderId: string, notes: string) => void;
  onAssignDriver: (orderId: string, driverName: string) => void;
}

function OrdersTab({
  orders,
  statusFilter,
  expandedOrder,
  onStatusFilterChange,
  onToggleExpand,
  onUpdateStatus,
  onUpdateNotes,
  onAssignDriver,
}: OrdersTabProps) {
  const drivers = [
    { name: 'Driver 1 - Michael' },
    { name: 'Driver 2 - Sarah' },
    { name: 'Driver 3 - James' },
    { name: 'Driver 4 - Emily' },
  ];

  return (
    <>
      {/* Status Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'] as const).map(status => (
          <button
            key={status}
            onClick={() => onStatusFilterChange(status)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
              statusFilter === status
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : formatStatus(status)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
          <span className="text-5xl mb-4 block">📭</span>
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrder === order.id}
              onToggleExpand={() => onToggleExpand(order.id)}
              onUpdateStatus={onUpdateStatus}
              onUpdateNotes={onUpdateNotes}
              onAssignDriver={onAssignDriver}
              drivers={drivers}
            />
          ))}
        </div>
      )}
    </>
  );
}

// Order Card Component
interface OrderCardProps {
  order: Order;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateNotes: (orderId: string, notes: string) => void;
  onAssignDriver: (orderId: string, driverName: string) => void;
  drivers: { name: string }[];
}

function OrderCard({
  order,
  isExpanded,
  onToggleExpand,
  onUpdateStatus,
  onUpdateNotes,
  onAssignDriver,
  drivers,
}: OrderCardProps) {
  const [notes, setNotes] = useState(order.notes || '');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden ${
      order.status === 'pending' ? 'ring-2 ring-yellow-400' : ''
    }`}>
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition"
        onClick={onToggleExpand}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {order.status === 'pending' ? '🆕' : order.status === 'confirmed' ? '✅' : '📦'}
            </span>
            <div>
              <p className="font-semibold text-gray-800">{order.customerName}</p>
              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-600">${order.total.toFixed(2)}</p>
            <StatusBadge status={order.status} />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t p-4 space-y-4">
          {/* Customer Contact */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              <span>👤</span> Customer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium">+1 {order.customerPhone}</p>
                  <a
                    href={`tel:+1${order.customerPhone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-green-700 transition"
                  >
                    📞 Call
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="font-medium">{order.deliveryLocation}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              <span>🛒</span> Order Items
            </h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500">x{item.quantity}</span>
                    <span className="ml-3 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <p className="font-medium">
                {order.paymentMethod === 'cash' ? '💵 Cash on Delivery' : '📱 Mobile Payment'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-sm text-gray-500 mb-1">Order Notes</p>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => onUpdateNotes(order.id, notes)}
                placeholder="Add notes..."
                className="w-full bg-transparent border-none outline-none font-medium"
              />
            </div>
          </div>

          {/* Driver Assignment */}
          {['confirmed', 'out_for_delivery'].includes(order.status) && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-medium text-blue-800 mb-2">Assign Driver</h3>
              <select
                value={order.assignedDriver?.name || ''}
                onChange={(e) => onAssignDriver(order.id, e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:border-blue-500 outline-none"
              >
                <option value="">Select a driver...</option>
                {drivers.map(driver => (
                  <option key={driver.name} value={driver.name}>{driver.name}</option>
                ))}
              </select>
              {order.assignedDriver && (
                <p className="text-sm text-blue-700 mt-2">
                  Assigned: <strong>{order.assignedDriver.name}</strong>
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {order.status === 'pending' && (
              <>
                <a
                  href={`tel:+1${order.customerPhone}`}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-green-700 transition"
                >
                  📞 Call Customer
                </a>
                <button
                  onClick={() => onUpdateStatus(order.id, 'confirmed')}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  ✓ Confirm Order
                </button>
                <button
                  onClick={() => onUpdateStatus(order.id, 'cancelled')}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                >
                  ✗ Cancel
                </button>
              </>
            )}
            {order.status === 'confirmed' && (
              <button
                onClick={() => onUpdateStatus(order.id, 'out_for_delivery')}
                className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                🚚 Out for Delivery
              </button>
            )}
            {order.status === 'out_for_delivery' && (
              <button
                onClick={() => onUpdateStatus(order.id, 'delivered')}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                ✓ Mark Delivered
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Products Tab Component
interface ProductsTabProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

function ProductsTab({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: ProductsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    price: 0,
    icon: '📦',
    category: 'Grains & Staples',
    unit: 'kg',
    stock: 0,
    lowStock: 10,
    description: '',
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price > 0) {
      onAddProduct(newProduct);
      setNewProduct({
        name: '',
        price: 0,
        icon: '📦',
        category: 'Grains & Staples',
        unit: 'kg',
        stock: 0,
        lowStock: 10,
        description: '',
      });
      setShowAddForm(false);
    }
  };

  const handleUpdateProduct = () => {
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
    }
  };

  return (
    <>
      {/* Add Product Button */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold mb-6 hover:bg-green-700 transition"
      >
        {showAddForm ? '✕ Cancel' : '➕ Add New Product'}
      </button>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Add New Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="e.g., Premium Rice"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input
                type="text"
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                placeholder="e.g., kg, pack, L"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
              <input
                type="number"
                value={newProduct.lowStock}
                onChange={(e) => setNewProduct({ ...newProduct, lowStock: parseInt(e.target.value) || 10 })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <div className="flex flex-wrap gap-2">
                {productIcons.map((icon: string) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewProduct({ ...newProduct, icon })}
                    className={`w-10 h-10 text-xl rounded-lg border-2 transition ${
                      newProduct.icon === icon ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Product description..."
                rows={2}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 outline-none resize-none"
              />
            </div>
          </div>
          <button
            onClick={handleAddProduct}
            className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Add Product
          </button>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="font-semibold text-gray-800 mb-4">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {productIcons.map((icon: string) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, icon })}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition ${
                        editingProduct.icon === icon ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Alert</label>
                <input
                  type="number"
                  value={editingProduct.lowStock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, lowStock: parseInt(e.target.value) || 10 })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-green-500 outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Product</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Price</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Stock</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.icon}</span>
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    ${product.price.toFixed(2)}/{product.unit}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock === 0 ? 'bg-red-100 text-red-700' :
                      product.stock <= product.lowStock ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {product.stock} {product.unit}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// Stock Tab Component
interface StockTabProps {
  products: Product[];
  lowStockProducts: Product[];
  outOfStockProducts: Product[];
  onUpdateStock: (id: string, quantity: number) => void;
}

function StockTab({ products, lowStockProducts, outOfStockProducts, onUpdateStock }: StockTabProps) {
  return (
    <>
      {/* Stock Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-2xl font-bold text-gray-800">{products.length}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 shadow-sm">
          <p className="text-orange-700 text-sm">⚠️ Low Stock</p>
          <p className="text-2xl font-bold text-orange-700">{lowStockProducts.length}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow-sm">
          <p className="text-red-700 text-sm">🔴 Out of Stock</p>
          <p className="text-2xl font-bold text-red-700">{outOfStockProducts.length}</p>
        </div>
      </div>

      {/* Out of Stock Alert */}
      {outOfStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-3">🚨 Out of Stock Items</h3>
          <div className="space-y-3">
            {outOfStockProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{product.icon}</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Qty"
                    className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-center"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onUpdateStock(product.id, parseInt((e.target as HTMLInputElement).value) || 0);
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      onUpdateStock(product.id, parseInt(input.value) || 0);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Restock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock Warning */}
      {lowStockProducts.filter(p => p.stock > 0).length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
          <h3 className="font-semibold text-orange-800 mb-3">⚠️ Low Stock Warning</h3>
          <div className="space-y-2">
            {lowStockProducts.filter(p => p.stock > 0).map(product => (
              <div key={product.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{product.icon}</span>
                  <span className="text-sm">{product.name}</span>
                </div>
                <span className="text-orange-600 font-medium text-sm">
                  {product.stock} / {product.lowStock} min
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Stock List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-800">📊 Full Inventory</h3>
        </div>
        <div className="divide-y">
          {products.map(product => (
            <div key={product.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{product.icon}</span>
                <div>
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    ${product.price.toFixed(2)} / {product.unit}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateStock(product.id, Math.max(0, product.stock - 5))}
                  className="w-8 h-8 bg-gray-100 rounded-lg text-lg font-bold text-gray-600 hover:bg-gray-200 transition"
                >
                  −
                </button>
                <span className={`w-16 text-center font-bold ${
                  product.stock === 0 ? 'text-red-600' :
                  product.stock <= product.lowStock ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {product.stock}
                </span>
                <button
                  onClick={() => onUpdateStock(product.id, product.stock + 5)}
                  className="w-8 h-8 bg-green-100 rounded-lg text-lg font-bold text-green-600 hover:bg-green-200 transition"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<OrderStatus, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '⏳ Pending' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: '✅ Confirmed' },
    out_for_delivery: { bg: 'bg-purple-100', text: 'text-purple-700', label: '🚚 Out for Delivery' },
    delivered: { bg: 'bg-green-100', text: 'text-green-700', label: '✓ Delivered' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: '✗ Cancelled' },
  };

  const { bg, text, label } = config[status];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

// Helper function
function formatStatus(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return labels[status];
}
