import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Plus, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LocationPrompt from '../components/LocationPrompt';
import ChatBot from '../components/ChatBot';
import useUserStore from '../stores/userStore';
import useLocationStore from '../stores/locationStore';

const ProductFeed = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableCategories, setAvailableCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { user } = useUserStore();
  const { location, permissionStatus, refreshLocationIfStale } = useLocationStore();
  const navigate = useNavigate();

  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token=localStorage.getItem('token')
      const res = await axios.get('http://localhost:5000/products/allproducts',{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fetchedProducts = res.data || [];
      setProducts(fetchedProducts);

      // Extract categories dynamically
      const categories = ['All', ...new Set(fetchedProducts.map(p => p.category || 'Other'))];
      setAvailableCategories(categories);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSearching(false);
      setSearchQuery(localSearchQuery);
    }, 300);

    // Show searching state when user is typing
    if (localSearchQuery !== searchQuery) {
      setIsSearching(true);
    }

    return () => clearTimeout(timer);
  }, [localSearchQuery, searchQuery]);

  // Location detection
  useEffect(() => {
    const checkLocationStatus = async () => {
      if (!location && permissionStatus !== 'denied') {
        setShowLocationPrompt(true);
      } else if (location) {
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

  // Apply filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Apply sorting
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
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
            </div>
          )}
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

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Skeleton Cards */}
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              {/* Image Skeleton */}
              <div className="w-full h-48 bg-gray-300"></div>
              
              {/* Content Skeleton */}
              <div className="p-4">
                {/* Title Skeleton */}
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                
                {/* Category Skeleton */}
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                
                {/* Price Skeleton */}
                <div className="h-5 bg-gray-300 rounded w-1/3 mb-4"></div>
                
                {/* Buttons Skeleton */}
                <div className="flex gap-2">
                  <div className="flex-1 h-9 bg-gray-200 rounded"></div>
                  <div className="w-9 h-9 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <Filter size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load products</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : !loading && !error ? (
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
      ) : null}

      {/* Chat Bot */}
      <ChatBot />
    </div>
  );
};

export default ProductFeed;
