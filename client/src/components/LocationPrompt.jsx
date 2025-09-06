import { useState } from 'react';
import { MapPin, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react';
import useLocationStore from '../stores/locationStore';

const LocationPrompt = ({ onClose }) => {
  const {
    location,
    isLoading,
    error,
    permissionStatus,
    getCurrentLocation,
    clearLocation,
  } = useLocationStore();

  const [showDetails, setShowDetails] = useState(false);

  const handleGetLocation = async () => {
    try {
      await getCurrentLocation();
    } catch (err) {
      console.error('Location error:', err);
    }
  };

  const handleDeny = () => {
    clearLocation();
    onClose();
  };

  if (location && !error) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-green-800">
                Location Detected
              </h3>
              <p className="text-sm text-green-600 mt-1">
                {location.address?.formatted || 'Location available'}
              </p>
              {showDetails && (
                <div className="mt-2 text-xs text-green-600 space-y-1">
                  <p>Latitude: {location.latitude.toFixed(6)}</p>
                  <p>Longitude: {location.longitude.toFixed(6)}</p>
                  <p>Accuracy: ±{Math.round(location.accuracy)}m</p>
                  <p>Last updated: {new Date(location.lastUpdated).toLocaleString()}</p>
                </div>
              )}
              <div className="mt-2 flex items-center space-x-2">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs text-green-700 hover:text-green-800 underline"
                >
                  {showDetails ? 'Hide details' : 'Show details'}
                </button>
                <button
                  onClick={handleGetLocation}
                  disabled={isLoading}
                  className="text-xs text-green-700 hover:text-green-800 underline flex items-center space-x-1"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-green-400 hover:text-green-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Location Access Failed
              </h3>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <div className="mt-2 flex items-center space-x-2">
                <button
                  onClick={handleGetLocation}
                  disabled={isLoading}
                  className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50 flex items-center space-x-1"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Try Again</span>
                </button>
                <button
                  onClick={handleDeny}
                  className="text-xs text-red-600 hover:text-red-700 underline"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Location Access Denied
              </h3>
              <p className="text-sm text-yellow-600 mt-1">
                To enable location features, please allow location access in your browser settings.
              </p>
              <button
                onClick={handleDeny}
                className="mt-2 text-xs text-yellow-600 hover:text-yellow-700 underline"
              >
                Continue without location
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-yellow-400 hover:text-yellow-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Default prompt for location access
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              Enable Location Services
            </h3>
            <p className="text-sm text-blue-600 mt-1">
              Allow location access to discover nearby products and sellers, and show location-based listings.
            </p>
            <div className="mt-3 flex items-center space-x-2">
              <button
                onClick={handleGetLocation}
                disabled={isLoading}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1"
              >
                {isLoading ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <MapPin className="h-3 w-3" />
                )}
                <span>{isLoading ? 'Getting location...' : 'Allow Location'}</span>
              </button>
              <button
                onClick={handleDeny}
                className="text-xs text-blue-600 hover:text-blue-700 underline"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-blue-400 hover:text-blue-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default LocationPrompt;
