import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Edit, Trash2 } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import useUserStore from '../stores/userStore';
import useCartStore from '../stores/cartStore';

const ProductCard = ({ product, showActions = false, onEdit, onDelete }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user.isLoggedIn) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    addToCart(product);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(product.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <Link to={`/product/${product.id}`}>
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2">
            <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
              <Heart size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              {product.category}
            </span>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            
            {showActions ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  title="Edit Product"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Product"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex items-center space-x-1 bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition-colors text-sm"
              >
                <ShoppingCart size={16} />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
