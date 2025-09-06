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
  Heart,
  Upload,
  X
} from 'lucide-react';
import { profileSchema } from '../utils/validation';
import { formatPrice, formatDate } from '../utils/helpers';
import { uploadImageToCloudinary } from '../utils/cloudinary';
import useUserStore from '../stores/userStore';
import useProductStore from '../stores/productStore';
import useCartStore from '../stores/cartStore';
import usePurchaseStore from '../stores/purchaseStore';
import useWishlistStore from '../stores/wishlistStore';
import useToast from '../hooks/useToast';

const Dashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const { user, updateProfile } = useUserStore();
  const { getUserProducts } = useProductStore();
  const { getCartItemsCount } = useCartStore();
  const { getPurchases } = usePurchaseStore();
  const { wishlistItems } = useWishlistStore();
  const { success, error } = useToast();

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
    success('Profile Updated', 'Your profile has been updated successfully!');
  };

  const handleCancelEdit = () => {
    reset({
      username: user.username,
      email: user.email
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      error('Invalid File', 'Please select an image file.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      error('File Too Large', 'Image size must be less than 5MB.');
      return;
    }

    try {
      setIsUploadingImage(true);
      
      // Create preview immediately
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const uploadResult = await uploadImageToCloudinary(file, {
        folder: 'profile_images'
      });

      if (uploadResult.success) {
        // Update user profile with new image URL
        updateProfile({ profileImage: uploadResult.url });
        success('Image Uploaded', 'Your profile picture has been updated successfully!');
        
        // Clear preview after successful upload since we'll use the profile image from store
        setTimeout(() => {
          setImagePreview(null);
        }, 500);
      } else {
        throw new Error(uploadResult.error || 'Upload failed');
      }
      
    } catch (err) {
      console.error('Image upload error:', err);
      error('Upload Failed', 'Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    updateProfile({ profileImage: '' });
    setImagePreview(null);
    success('Image Removed', 'Your profile picture has been removed.');
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
              <div className="relative group">
                {/* Image Display */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {imagePreview || user.profileImage ? (
                    <img
                      src={imagePreview || user.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to default avatar if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Default Avatar - always present as fallback */}
                  <div 
                    className={`w-full h-full bg-green-500 flex items-center justify-center ${
                      (imagePreview || user.profileImage) ? 'hidden' : 'flex'
                    }`}
                  >
                    <span className="text-white text-2xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Loading Overlay */}
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md border hover:bg-gray-50 transition-colors cursor-pointer">
                  <Camera size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                </label>

                {/* Remove Button (show only if user has a profile image) */}
                {(user.profileImage && !imagePreview) && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                    title="Remove profile picture"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              
              <div className="text-center mt-2">
                <p className="text-sm text-gray-500">Profile Picture</p>
                <p className="text-xs text-gray-400 mt-1">
                  Click camera icon to upload • Max 5MB
                </p>
              </div>
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

              {/* Image Upload Section (only when editing) */}
              {isEditing && (
                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors cursor-pointer">
                      <Upload size={16} />
                      <span className="text-sm text-gray-600">Upload New Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploadingImage}
                      />
                    </label>
                    
                    {user.profileImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <X size={16} />
                        <span className="text-sm">Remove Photo</span>
                      </button>
                    )}
                  </div>
                  
                  {isUploadingImage && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      <span>Uploading image...</span>
                    </div>
                  )}
                </div>
              )}

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
                <span className="text-sm font-medium text-gray-700">Sell Product</span>
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
