import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Plus, LogOut, Menu, X, Heart, MapPin } from 'lucide-react';
import { useState } from 'react';
import useUserStore from '../stores/userStore';
import useCartStore from '../stores/cartStore';
import useWishlistStore from '../stores/wishlistStore';
import useLocationStore from '../stores/locationStore';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useUserStore();
  const { getCartItemsCount } = useCartStore();
  const { getWishlistCount } = useWishlistStore();
  const { location } = useLocationStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleAuthClick = () => {
    if (user.isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
    setIsMobileMenuOpen(false);
  };

  const cartItemsCount = getCartItemsCount();
  const wishlistCount = getWishlistCount();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EcoFinds</span>
          </Link>

          {/* Location Indicator */}
          {location && (
            <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
              <MapPin size={14} />
              <span className="truncate max-w-32">
                {location.address?.city || 'Current Location'}
              </span>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Browse Products
            </Link>
            {user.isLoggedIn && (
              <>
                <Link 
                  to="/add-product" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <Plus size={16} />
                  <span>Add Product</span>
                </Link>
                <Link 
                  to="/my-listings" 
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  My Listings
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {user.isLoggedIn && (
              <>
                <Link 
                  to="/wishlist" 
                  className="relative p-2 text-gray-700 hover:text-red-500 transition-colors"
                  title="Wishlist"
                >
                  <Heart size={24} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                
                <Link 
                  to="/cart" 
                  className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
                  title="Shopping Cart"
                >
                  <ShoppingCart size={24} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            
            <button
              onClick={handleAuthClick}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <User size={20} />
              <span>{user.isLoggedIn ? user.username : 'Login'}</span>
            </button>

            {user.isLoggedIn && (
              <button
                onClick={handleLogout}
                className="p-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-green-600 transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Products
              </Link>
              
              {user.isLoggedIn && (
                <>
                  <Link 
                    to="/add-product" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Plus size={16} />
                    <span>Add Product</span>
                  </Link>
                  <Link 
                    to="/my-listings" 
                    className="text-gray-700 hover:text-green-600 transition-colors px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Listings
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-500 transition-colors px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart size={16} />
                    <span>Wishlist ({wishlistCount})</span>
                  </Link>
                  <Link 
                    to="/cart" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors px-2 py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingCart size={16} />
                    <span>Cart ({cartItemsCount})</span>
                  </Link>
                </>
              )}
              
              <button
                onClick={handleAuthClick}
                className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors px-2 py-1 text-left"
              >
                <User size={16} />
                <span>{user.isLoggedIn ? user.username : 'Login'}</span>
              </button>

              {user.isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors px-2 py-1 text-left"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
