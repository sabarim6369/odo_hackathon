import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, ArrowLeft, MapPin, RefreshCw, X, CheckCircle, AlertCircle } from 'lucide-react';
import { productSchema, categories } from '../utils/validation';
import { uploadImageToCloudinary, compressImage } from '../utils/cloudinary';
import useProductStore from '../stores/productStore';
import useUserStore from '../stores/userStore';
import useLocationStore from '../stores/locationStore';

const AddProduct = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
  
  const { addProduct } = useProductStore();
  const { user } = useUserStore();
  const { location, isLoading, getCurrentLocation } = useLocationStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(productSchema)
  });

  const onSubmit = async (data) => {
    try {
      const newProduct = {
        ...data,
        price: parseFloat(data.price),
        userId: user.id,
        image: cloudinaryUrl || imagePreview || `https://via.placeholder.com/300x300/4ade80/ffffff?text=${encodeURIComponent(data.title)}`,
        // Add location data if available
        ...(useCurrentLocation && location && {
          latitude: location.latitude,
          longitude: location.longitude,
          location: location.address?.formatted || 'Current Location'
        }),
        ...(manualLocation && !useCurrentLocation && {
          location: manualLocation
        })
      };
      
      addProduct(newProduct);
      
      alert('Product added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      setImageUploadError(null);
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Compress image before upload
      const compressedFile = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
      });

      // Upload to Cloudinary
      const uploadResult = await uploadImageToCloudinary(compressedFile, {
        folder: 'ecofinds/products',
        publicId: `product_${Date.now()}`,
      });

      if (uploadResult.success) {
        setCloudinaryUrl(uploadResult.url);
        setImageUploadError(null);
      } else {
        setImageUploadError(uploadResult.error);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setImageUploadError(error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setCloudinaryUrl(null);
    setImageUploadError(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleGetCurrentLocation = async () => {
    try {
      await getCurrentLocation();
      setUseCurrentLocation(true);
      setManualLocation('');
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const handleLocationToggle = (useLocation) => {
    setUseCurrentLocation(useLocation);
    if (useLocation) {
      setManualLocation('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Back to Browse</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">
          List your pre-owned item and contribute to sustainable living
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
          <div className="flex flex-col items-center">
            {imagePreview ? (
              <div className="relative mb-4">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-48 h-48 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
                
                {/* Upload Status Indicators */}
                {imageUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <RefreshCw className="animate-spin h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Uploading to Cloudinary...</p>
                    </div>
                  </div>
                )}
                
                {cloudinaryUrl && !imageUploading && (
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white rounded-full p-1" title="Uploaded to Cloudinary">
                    <CheckCircle size={16} />
                  </div>
                )}
                
                {imageUploadError && !imageUploading && (
                  <div className="absolute bottom-2 left-2 bg-red-500 text-white rounded-full p-1" title={imageUploadError}>
                    <AlertCircle size={16} />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 hover:border-green-400 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Upload image</p>
                </div>
              </div>
            )}
            
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={imageUploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            {/* Upload Status Messages */}
            {imageUploading && (
              <p className="text-xs text-blue-600 mt-2 flex items-center">
                <RefreshCw className="animate-spin h-3 w-3 mr-1" />
                Uploading to Cloudinary...
              </p>
            )}
            
            {cloudinaryUrl && !imageUploading && (
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Image uploaded successfully to Cloudinary
              </p>
            )}
            
            {imageUploadError && !imageUploading && (
              <p className="text-xs text-red-600 mt-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Upload failed: {imageUploadError}
              </p>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              Images are automatically uploaded to Cloudinary cloud storage for optimal performance
            </p>
          </div>
        </div>

        {/* Product Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Product Title *
          </label>
          <input
            {...register('title')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="What are you selling?"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            {...register('category')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price (₹) *
          </label>
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location (Optional)
          </label>
          
          <div className="space-y-3">
            {/* Current Location Option */}
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="currentLocation"
                name="locationOption"
                checked={useCurrentLocation}
                onChange={() => handleLocationToggle(true)}
                className="text-green-500 focus:ring-green-500"
              />
              <label htmlFor="currentLocation" className="text-sm text-gray-700 flex items-center space-x-2">
                <MapPin size={16} />
                <span>Use Current Location</span>
              </label>
              {!useCurrentLocation && (
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={isLoading}
                  className="text-xs text-green-600 hover:text-green-700 underline flex items-center space-x-1"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Getting...' : 'Get Location'}</span>
                </button>
              )}
            </div>

            {/* Show current location if available */}
            {useCurrentLocation && location && (
              <div className="ml-6 text-sm text-gray-600 bg-green-50 p-2 rounded">
                📍 {location.address?.formatted || 'Current Location'}
              </div>
            )}

            {/* Manual Location Option */}
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="manualLocation"
                name="locationOption"
                checked={!useCurrentLocation}
                onChange={() => handleLocationToggle(false)}
                className="text-green-500 focus:ring-green-500"
              />
              <label htmlFor="manualLocation" className="text-sm text-gray-700">
                Enter Location Manually
              </label>
            </div>

            {/* Manual Location Input */}
            {!useCurrentLocation && (
              <input
                type="text"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                placeholder="e.g., Mumbai, Maharashtra"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            )}
          </div>
          
          <p className="mt-1 text-xs text-gray-500">
            Adding location helps buyers find products near them
          </p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Describe your product, its condition, and any relevant details..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Tips */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Tips for a great listing:</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Use clear, well-lit photos from multiple angles</li>
            <li>• Be honest about the item's condition</li>
            <li>• Include dimensions and specifications</li>
            <li>• Set a fair and competitive price</li>
            <li>• Respond promptly to buyer inquiries</li>
          </ul>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || imageUploading}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {imageUploading ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                Uploading Image...
              </>
            ) : isSubmitting ? (
              'Adding Product...'
            ) : (
              'Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
