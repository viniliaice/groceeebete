import { useState } from 'react';
import { useStore } from './store/useStore';
import { Page } from './types';
import { Header } from './components/Header';
import { ShopPage } from './components/ShopPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { MyOrdersPage } from './components/MyOrdersPage';
import { AdminPanel } from './components/AdminPanel';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('shop');
  const [customerPhone, setCustomerPhone] = useState('');
  const store = useStore();

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Derive values from store
  const cartCount = store.getCartItemCount();
  const newOrderCount = store.getPendingOrdersCount();

  const handlePlaceOrder = async (customerData: {
    name: string;
    phone: string;
    location: string;
    notes: string;
    paymentMethod: 'cash' | 'telebirr';
  }) => {
    setCustomerPhone(customerData.phone);
    await store.placeOrder(customerData);
    navigateTo('order-success');
  };

  const handleAssignDriver = (orderId: string, driverName: string) => {
    // For simplicity, we use a placeholder phone for drivers
    store.assignDriver(orderId, driverName, '555-0100');
  };

  // Get low stock and out of stock products
  const lowStockProducts = store.products.filter(p => p.stock > 0 && p.stock <= p.lowStock);
  const outOfStockProducts = store.products.filter(p => p.stock === 0);

  const renderPage = () => {
    switch (currentPage) {
      case 'shop':
        return (
          <ShopPage
            products={store.products}
            cart={store.cart}
            onAddToCart={store.addToCart}
            onUpdateQuantity={store.updateQuantity}
            isLoading={store.isLoading}
          />
        );
      case 'cart':
        return (
          <CartPage
            cart={store.cart}
            onUpdateQuantity={store.updateQuantity}
            onRemoveItem={store.removeFromCart}
            cartTotal={store.getCartTotal()}
            onCheckout={() => navigateTo('checkout')}
            onBack={() => navigateTo('shop')}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            cart={store.cart}
            cartTotal={store.getCartTotal()}
            onPlaceOrder={handlePlaceOrder}
            onBack={() => navigateTo('cart')}
          />
        );
      case 'order-success':
        return (
          <OrderSuccessPage
            order={store.lastOrder}
            onContinueShopping={() => navigateTo('shop')}
            onViewOrders={() => navigateTo('my-orders')}
          />
        );
      case 'my-orders':
        return (
          <MyOrdersPage
            orders={store.orders.filter(o => o.customerPhone === customerPhone)}
            onBack={() => navigateTo('shop')}
          />
        );
      case 'admin':
        return (
          <AdminPanel
            orders={store.orders}
            products={store.products}
            lowStockProducts={lowStockProducts}
            outOfStockProducts={outOfStockProducts}
            onUpdateStatus={store.updateOrderStatus}
            onUpdateNotes={store.updateOrderNotes}
            onAssignDriver={handleAssignDriver}
            onAddProduct={store.addProduct}
            onUpdateProduct={store.updateProduct}
            onDeleteProduct={store.deleteProduct}
            onUpdateStock={store.updateStock}
          />
        );
      default:
        return <ShopPage products={store.products} cart={store.cart} onAddToCart={store.addToCart} onUpdateQuantity={store.updateQuantity} isLoading={store.isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartCount={cartCount}
        currentPage={currentPage}
        onNavigate={navigateTo}
        newOrderCount={newOrderCount}
      />
      <main className="pb-20 md:pb-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
