import { Page } from '../types';

interface HeaderProps {
  cartCount: number;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  newOrderCount: number;
}

export function Header({ cartCount, currentPage, onNavigate, newOrderCount }: HeaderProps) {
  return (
    <>
      {/* Desktop Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => onNavigate('shop')}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <span className="text-2xl">🛒</span>
              <span className="text-xl font-bold text-green-600">FreshCart</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => onNavigate('shop')}
                className={`font-medium transition ${
                  currentPage === 'shop' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                }`}
              >
                Shop
              </button>
              <button
                onClick={() => onNavigate('my-orders')}
                className={`font-medium transition ${
                  currentPage === 'my-orders' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                }`}
              >
                My Orders
              </button>
              <button
                onClick={() => onNavigate('admin')}
                className={`font-medium transition flex items-center gap-1 ${
                  currentPage === 'admin' ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                }`}
              >
                Admin
                {newOrderCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {newOrderCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Cart Button */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
            >
              <span>🛒</span>
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => onNavigate('shop')}
            className={`flex flex-col items-center px-4 py-1 ${
              currentPage === 'shop' ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">🏪</span>
            <span className="text-xs font-medium">Shop</span>
          </button>
          <button
            onClick={() => onNavigate('cart')}
            className={`flex flex-col items-center px-4 py-1 relative ${
              currentPage === 'cart' ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">🛒</span>
            <span className="text-xs font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onNavigate('my-orders')}
            className={`flex flex-col items-center px-4 py-1 ${
              currentPage === 'my-orders' ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">📦</span>
            <span className="text-xs font-medium">Orders</span>
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`flex flex-col items-center px-4 py-1 relative ${
              currentPage === 'admin' ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            <span className="text-xl">⚙️</span>
            <span className="text-xs font-medium">Admin</span>
            {newOrderCount > 0 && (
              <span className="absolute top-0 right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {newOrderCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
