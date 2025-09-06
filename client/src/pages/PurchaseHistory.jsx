import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, Filter } from 'lucide-react';
import { formatPrice, formatDate } from '../utils/helpers';
import usePurchaseStore from '../stores/purchaseStore';

const PurchaseHistory = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const { getPurchases } = usePurchaseStore();
  const navigate = useNavigate();

  const purchases = getPurchases();
  
  // Filter purchases by status
  const filteredPurchases = purchases.filter(purchase => {
    if (statusFilter === 'All') return true;
    return purchase.status === statusFilter;
  });

  // Sort purchases
  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.purchaseDate) - new Date(b.purchaseDate);
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'newest':
      default:
        return new Date(b.purchaseDate) - new Date(a.purchaseDate);
    }
  });

  const statusOptions = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Purchase History</h1>
        <p className="text-gray-600 mt-2">
          Track your orders and view past purchases
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{purchases.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">₹</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatPrice(totalSpent)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {purchases.filter(p => {
                  const purchaseMonth = new Date(p.purchaseDate).getMonth();
                  const currentMonth = new Date().getMonth();
                  return purchaseMonth === currentMonth;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Purchase List */}
      {sortedPurchases.length > 0 ? (
        <div className="space-y-4">
          {sortedPurchases.map((purchase) => (
            <div key={purchase.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {purchase.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      purchase.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      purchase.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      purchase.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {purchase.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Order ID:</span> {purchase.transactionId}
                    </div>
                    <div>
                      <span className="font-medium">Purchase Date:</span> {formatDate(purchase.purchaseDate)}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> {formatPrice(purchase.price)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
                    View Details
                  </button>
                  {purchase.status === 'Delivered' && (
                    <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm">
                      Buy Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {statusFilter === 'All' ? (
              <Package size={48} className="mx-auto" />
            ) : (
              <Filter size={48} className="mx-auto" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {statusFilter === 'All' ? 'No purchases yet' : `No ${statusFilter.toLowerCase()} orders`}
          </h3>
          <p className="text-gray-600 mb-6">
            {statusFilter === 'All' 
              ? "Start shopping to see your purchase history here."
              : `No orders found with status "${statusFilter}".`
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {statusFilter !== 'All' && (
              <button
                onClick={() => setStatusFilter('All')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Show All Orders
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {statusFilter === 'All' ? 'Start Shopping' : 'Browse Products'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
