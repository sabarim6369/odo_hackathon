import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Edit, 
  Save,
  Camera,
  Eye,
  Calendar,
  Heart
} from 'lucide-react';
import { profileSchema } from '../utils/validation';
import { formatPrice, formatDate } from '../utils/helpers';
import useUserStore from '../stores/userStore';
import useProductStore from '../stores/productStore';
import useCartStore from '../stores/cartStore';
import usePurchaseStore from '../stores/purchaseStore';
import useWishlistStore from '../stores/wishlistStore';

const Dashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateProfile } = useUserStore();
  const { getUserProducts } = useProductStore();
  const { getCartItemsCount } = useCartStore();
  const { getPurchases } = usePurchaseStore();
  const { wishlistItems } = useWishlistStore();

  const userProducts = getUserProducts(user.id);
  const cartItemsCount = getCartItemsCount();
  const purchases = getPurchases();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user.username,
      email: user.email
    }
  });

  const onSubmit = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateProfile(data);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    reset({
      username: user.username,
      email: user.email
    });
    setIsEditing(false);
  };

  const totalPurchases = purchases.reduce((sum, purchase) => sum + purchase.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user.username}! Here's your account overview.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border hover:bg-gray-50 transition-colors">
                  <Camera size={14} />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Profile Picture</p>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  {...register('username')}
                  type="text"
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center space-x-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    <span>{isSubmitting ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Stats and Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">My Listings</p>
                  <p className="text-2xl font-semibold text-gray-900">{userProducts.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Cart Items</p>
                  <p className="text-2xl font-semibold text-gray-900">{cartItemsCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Wishlist</p>
                  <p className="text-2xl font-semibold text-gray-900">{wishlistItems.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Spent</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatPrice(totalPurchases)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <Link
                to="/add-product"
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <Package className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">Add Product</span>
              </Link>

              <Link
                to="/my-listings"
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Edit className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">Manage Listings</span>
              </Link>

              <Link
                to="/cart"
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <ShoppingCart className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">View Cart</span>
              </Link>

              <Link
                to="/wishlist"
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
              >
                <Heart className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">My Wishlist</span>
              </Link>

              <Link
                to="/purchases"
                className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
              >
                <Calendar className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">Purchase History</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            {purchases.length > 0 ? (
              <div className="space-y-3">
                {purchases.slice(0, 3).map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">{purchase.title}</p>
                      <p className="text-sm text-gray-500">
                        Purchased on {formatDate(purchase.purchaseDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(purchase.price)}</p>
                      <p className="text-sm text-green-600">{purchase.status}</p>
                    </div>
                  </div>
                ))}
                <Link
                  to="/purchases"
                  className="block text-center text-green-600 hover:text-green-700 text-sm mt-4"
                >
                  View all purchases →
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No recent activity. <Link to="/" className="text-green-600 hover:underline">Start shopping!</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
