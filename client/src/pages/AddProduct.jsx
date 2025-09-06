import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, ArrowLeft, MapPin, RefreshCw, X, CheckCircle, AlertCircle, ImagePlus } from 'lucide-react';
import { productSchema, categories } from '../utils/validation';
import { uploadMultipleImagesToCloudinary } from '../utils/cloudinary';
import useProductStore from '../stores/productStore';
import useUserStore from '../stores/userStore';
import useLocationStore from '../stores/locationStore';
import useToast from '../hooks/useToast';

const AddProduct = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [cloudinaryUrls, setCloudinaryUrls] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  
  const { addProduct } = useProductStore();
  const { user } = useUserStore();
  const { location, isLoading, getCurrentLocation } = useLocationStore();
  const { success, error } = useToast();
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
        userId: user.id,
        image: cloudinaryUrls.length > 0 ? cloudinaryUrls[0] : `https://via.placeholder.com/300x300/4ade80/ffffff?text=${encodeURIComponent(data.title)}`,
        images: cloudinaryUrls.length > 0 ? cloudinaryUrls : [`https://via.placeholder.com/300x300/4ade80/ffffff?text=${encodeURIComponent(data.title)}`],
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
      
      success('Product Added!', 'Your product has been successfully listed and is now available for sale.');
      navigate('/');
    } catch (err) {
      console.error('Error adding product:', err);
      error('Failed to Sell Product', 'Something went wrong while listing your product. Please try again.');
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setImageUploading(true);
      setImageUploadError(null);

      // Create previews for all selected images
      const previews = await Promise.all(
        files.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        })
      );
      
      // Add new previews to existing ones
      setImagePreviews(prev => [...prev, ...previews]);

      // Upload multiple images to Cloudinary
      const uploadResult = await uploadMultipleImagesToCloudinary(files, {
        folder: 'ecofinds/products',
        publicId: `product_${Date.now()}`,
      }, (current, total) => {
        setUploadProgress({ current, total });
      });

      if (uploadResult.success && uploadResult.urls.length > 0) {
        setCloudinaryUrls(prev => [...prev, ...uploadResult.urls]);
        setImageUploadError(null);
        
        if (uploadResult.errors.length > 0) {
          console.warn('Some images failed to upload:', uploadResult.errors);
          setImageUploadError(`${uploadResult.totalUploaded}/${uploadResult.totalFiles} images uploaded successfully. Some uploads failed.`);
        }
      } else {
        setImageUploadError(uploadResult.error || 'Failed to upload images');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setImageUploadError(error.message);
    } finally {
      setImageUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const handleRemoveImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setCloudinaryUrls(prev => prev.filter((_, i) => i !== index));
    
    // If no images left, clear any errors
    if (imagePreviews.length === 1) {
      setImageUploadError(null);
    }
    
    // Reset file input if no images left
    if (imagePreviews.length === 1) {
      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';
    }
  };

  const handleRemoveAllImages = () => {
    setImagePreviews([]);
    setCloudinaryUrls([]);
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
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell New Product</h1>
        <p className="text-gray-600">
          List your pre-owned item and contribute to sustainable living
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Multiple Product Images Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Product Images *
          </label>
          
          {/* Image Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-400 transition-colors">
            {/* Main Upload Button */}
            <div className="text-center">
              <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                <ImagePlus size={64} />
              </div>
              <label htmlFor="image-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Upload product images
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  Select multiple images (PNG, JPG, JPEG up to 10MB each)
                </span>
              </label>
              
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={imageUploading}
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => document.getElementById('image-upload').click()}
                disabled={imageUploading}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {imageUploading ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="-ml-1 mr-2 h-4 w-4" />
                    Choose Images
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Upload Progress */}
          {imageUploading && uploadProgress.total > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading images to Cloudinary...</span>
                <span>{uploadProgress.current}/{uploadProgress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Image Previews Grid */}
          {imagePreviews.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  Selected Images ({imagePreviews.length})
                </h3>
                <button
                  type="button"
                  onClick={handleRemoveAllImages}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Remove All
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={preview}
                        alt={`Product preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                    
                    {/* Upload Status Indicator */}
                    {imageUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                        <RefreshCw className="animate-spin h-5 w-5 text-white" />
                      </div>
                    )}
                    
                    {/* Success Indicator */}
                    {cloudinaryUrls[index] && !imageUploading && (
                      <div className="absolute bottom-2 left-2 bg-green-500 text-white rounded-full p-1" title="Uploaded successfully">
                        <CheckCircle size={16} />
                      </div>
                    )}
                    
                    {/* Image Number Badge */}
                    <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Status Messages */}
          {cloudinaryUrls.length > 0 && !imageUploading && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                {cloudinaryUrls.length} image(s) uploaded successfully to Cloudinary
              </p>
            </div>
          )}
          
          {imageUploadError && !imageUploading && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {imageUploadError}
              </p>
            </div>
          )}
        </div>

        {/* Product Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Product Title *
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Enter product title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price (₹) *
          </label>
          <input
            {...register('price')}
            type="number"
            id="price"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Enter price"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            {...register('category')}
            id="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Describe your product in detail..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Location Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Location
          </label>
          
          {/* Location Toggle */}
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => handleLocationToggle(true)}
              className={`flex items-center px-4 py-2 rounded-md border transition-colors ${
                useCurrentLocation
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              disabled={isLoading}
            >
              <MapPin size={16} className="mr-2" />
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  Getting location...
                </>
              ) : (
                'Use Current Location'
              )}
            </button>
            <button
              type="button"
              onClick={() => handleLocationToggle(false)}
              className={`px-4 py-2 rounded-md border transition-colors ${
                !useCurrentLocation
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Enter Manually
            </button>
          </div>

          {/* Current Location Display */}
          {useCurrentLocation && location && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Current Location</p>
                  <p className="text-sm text-green-600">
                    {location.address?.formatted || `${location.latitude}, ${location.longitude}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Manual Location Input */}
          {!useCurrentLocation && (
            <div>
              <input
                type="text"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your location (e.g., City, State)"
              />
            </div>
          )}

          {/* Get Current Location Button */}
          {useCurrentLocation && !location && (
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  Getting location...
                </>
              ) : (
                <>
                  <MapPin size={16} className="mr-2" />
                  Get Current Location
                </>
              )}
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || imageUploading || cloudinaryUrls.length === 0}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {imageUploading ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                Uploading Images...
              </>
            ) : isSubmitting ? (
              'Listing Product...'
            ) : (
              'Sell Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
