import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import useCartStore from '../stores/cartStore';
import usePurchaseStore from '../stores/purchaseStore';
import useToast from '../hooks/useToast';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCartStore();
  const { addPurchase } = usePurchaseStore();
  const { success, warning } = useToast();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      const product = cartItems.find(item => item.id === productId);
      removeFromCart(productId);
      if (product) {
        warning('Item Removed', `${product.title} has been removed from your cart.`);
      }
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (product) => {
    removeFromCart(product.id);
    warning('Item Removed', `${product.title} has been removed from your cart.`);
  };

  const handleClearCart = () => {
    const itemCount = cartItems.length;
    clearCart();
    warning('Cart Cleared', `All ${itemCount} item${itemCount !== 1 ? 's' : ''} have been removed from your cart.`);
  };

  const handleCheckout = () => {
    // Mock checkout process
    const itemCount = cartItems.length;
    addPurchase(cartItems);
    clearCart();
    
    success('Order Placed!', `Successfully ordered ${itemCount} item${itemCount !== 1 ? 's' : ''}. Check your purchase history.`);
    navigate('/purchases');
  };

  const totalAmount = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ShoppingBag size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">
            Start shopping to add items to your cart.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Continue Shopping</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-2">
          {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Category: {item.category}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {formatPrice(item.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col sm:items-end gap-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    
                    <span className="font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span className="text-sm">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Clear Cart Button */}
          <div className="flex justify-end">
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 transition-colors text-sm"
            >
              Clear entire cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatPrice(totalAmount * 0.08)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-gray-900">
                    {formatPrice(totalAmount * 1.08)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                This is a demo checkout. No actual payment will be processed.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Free returns within 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
