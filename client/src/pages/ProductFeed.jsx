import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LocationPrompt from '../components/LocationPrompt';
import useProductStore from '../stores/productStore';
import useUserStore from '../stores/userStore';
import useLocationStore from '../stores/locationStore';

const ProductFeed = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  
  const { 
    getFilteredProducts, 
    searchQuery, 
    selectedCategory, 
    setSearchQuery, 
    setSelectedCategory,
    getCategories 
  } = useProductStore();
  
  const { user } = useUserStore();
  const { location, permissionStatus, refreshLocationIfStale } = useLocationStore();
  const navigate = useNavigate();

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const filteredProducts = getFilteredProducts();
  const availableCategories = getCategories();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery, setSearchQuery]);

  // Location detection
  useEffect(() => {
    const checkLocationStatus = async () => {
      // Show location prompt if no location and permission not denied
      if (!location && permissionStatus !== 'denied') {
        setShowLocationPrompt(true);
      } else if (location) {
        // Refresh location if stale
        try {
          await refreshLocationIfStale();
        } catch (error) {
          console.log('Location refresh failed:', error);
        }
      }
    };

    checkLocationStatus();
  }, [location, permissionStatus, refreshLocationIfStale]);

  const handleAddProduct = () => {
    if (!user.isLoggedIn) {
      navigate('/login', { state: { from: '/add-product' } });
      return;
    }
    navigate('/add-product');
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.title.localeCompare(b.title);
      case 'newest':
      default:
        return b.id - a.id;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Location Prompt */}
      {showLocationPrompt && (
        <LocationPrompt onClose={() => setShowLocationPrompt(false)} />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discover Sustainable Finds</h1>
            <p className="text-gray-600 mt-2">
              Browse quality pre-owned items and contribute to a circular economy
            </p>
          </div>
          
          <button
            onClick={handleAddProduct}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus size={20} />
            <span>Sell Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex-1">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {availableCategories.map(category => (
                <option key={category} value={category}>
                  {category === 'All' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
        </div>

        {/* Mobile Filter Panel */}
        {showFilters && (
          <div className="sm:hidden bg-gray-50 p-4 rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {availableCategories.map(category => (
                    <option key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSearchQuery('');
                setLocalSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add First Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFeed;
