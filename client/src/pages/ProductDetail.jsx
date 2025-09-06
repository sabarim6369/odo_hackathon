import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingCart, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import useProductStore from '../stores/productStore';
import useUserStore from '../stores/userStore';
import useCartStore from '../stores/cartStore';
import usePurchaseStore from '../stores/purchaseStore';
import useWishlistStore from '../stores/wishlistStore';
import useToast from '../hooks/useToast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProductStore();
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const { addPurchase } = usePurchaseStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { success, error, warning } = useToast();

  const product = getProductById(id);
  
  // State for image gallery
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Get product images array, fallback to single image
  const productImages = product?.images && product.images.length > 0 
    ? product.images 
    : product?.image 
      ? [product.image] 
      : [];

  const isProductInWishlist = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user.isLoggedIn) {
      warning('Login Required', 'Please login to add items to your cart.');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    try {
      addToCart(product);
      success('Added to Cart', `${product.title} has been added to your cart!`);
    } catch {
      error('Failed to Add', 'Could not add item to cart. Please try again.');
    }
  };

  const handleBuyNow = () => {
    if (!user.isLoggedIn) {
      warning('Login Required', 'Please login to make a purchase.');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    try {
      // Mock payment process
      const cartItems = [product];
      addPurchase(cartItems);
      
      success('Purchase Successful!', 'Your order has been placed. Check your purchase history.');
      navigate('/purchases');
    } catch {
      error('Purchase Failed', 'Could not complete your purchase. Please try again.');
    }
  };

  const handleWishlistToggle = () => {
    if (!user.isLoggedIn) {
      warning('Login Required', 'Please login to manage your wishlist.');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      if (isProductInWishlist) {
        removeFromWishlist(product.id);
        warning('Removed from Wishlist', `${product.title} has been removed from your wishlist.`);
      } else {
        addToWishlist(product);
        success('Added to Wishlist', `${product.title} has been added to your wishlist!`);
      }
    } catch {
      error('Action Failed', 'Could not update your wishlist. Please try again.');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      }).then(() => {
        success('Shared Successfully', 'Product has been shared!');
      }).catch(() => {
        error('Share Failed', 'Could not share this product. Please try again.');
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        success('Link Copied', 'Product link has been copied to your clipboard!');
      }).catch(() => {
        error('Copy Failed', 'Could not copy link. Please try again.');
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Products</span>
      </button>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={productImages[selectedImageIndex] || product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail gallery */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 cursor-pointer transition-colors ${
                    selectedImageIndex === index 
                      ? 'border-green-500' 
                      : 'border-transparent hover:border-green-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Image Counter */}
          {productImages.length > 1 && (
            <div className="text-center text-sm text-gray-500">
              {selectedImageIndex + 1} of {productImages.length} images
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category Badge */}
          <div>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {product.category}
            </span>
          </div>

          {/* Title and Price */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <div className="text-3xl font-bold text-green-600">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Condition</dt>
                <dd className="text-sm text-gray-900">Excellent</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="text-sm text-gray-900">{product.category}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Listed by</dt>
                <dd className="text-sm text-gray-900">Verified Seller</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="text-sm text-gray-900">Local Pickup Available</dd>
              </div>
            </dl>
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
              
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Buy Now
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex justify-center space-x-6">
              <button 
                onClick={handleWishlistToggle}
                className={`flex items-center space-x-2 transition-colors ${
                  isProductInWishlist 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart size={20} fill={isProductInWishlist ? 'currentColor' : 'none'} />
                <span>{isProductInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
              >
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="border-t pt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Safety First</h4>
              <p className="text-sm text-blue-800">
                Always meet in a public place for transactions. Inspect items carefully before purchase. 
                EcoFinds promotes safe and sustainable trading practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
        <div className="text-center py-8 text-gray-500">
          <p>Related products feature coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
