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
import axios from 'axios';
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
    const selectedCategory = categories.find(
      (cat) => cat.id === Number(data.categoryId)
    );
    console.log(cloudinaryUrls)

    const payload = {
      title: data.title,
      description: data.description,
      price: Number(data.price),
      quantity: Number(data.quantity),
      categoryId: Number(data.categoryId),
      categoryName: selectedCategory?.name || "Unknown",
      images: cloudinaryUrls.length > 0
        ? cloudinaryUrls.map((url) => ({ url }))
        : [
            {
              url: `https://via.placeholder.com/300x300/4ade80/ffffff?text=${encodeURIComponent(
                data.title
              )}`,
            },
          ],
      userId: user.id,
      ...(useCurrentLocation && location && {
        latitude: location.latitude,
        longitude: location.longitude,
        location: location.address?.formatted || "Current Location",
      }),
      ...(manualLocation && !useCurrentLocation && {
        location: manualLocation,
      }),
    };

    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:5000/products",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    addProduct(payload);

    success(
      "Product Added!",
      "Your product has been successfully listed and is now available for sale."
    );
    navigate("/");
  } catch (err) {
    console.error("Error adding product:", err);
    error(
      "Failed to Add Product",
      "Something went wrong while listing your product. Please try again."
    );
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
  <div className="max-w-4xl mx-auto px-6 py-10">
    <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-6 border-b bg-gradient-to-r from-green-50 to-white">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-green-700 transition-colors mb-3"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Home
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Sell New Product</h1>
        <p className="text-gray-500 mt-1">
          List your pre-owned item and contribute to sustainable living 🌱
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Product Images <span className="text-red-500">*</span>
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition cursor-pointer">
            <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
              <ImagePlus size={64} />
            </div>
            <p className="text-gray-700 font-medium">Upload product images</p>
            <p className="text-sm text-gray-500">
              Select multiple images (PNG, JPG, JPEG up to 10MB each)
            </p>

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
              className="mt-4 inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition disabled:opacity-50"
            >
              {imageUploading ? (
                <>
                  <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Images
                </>
              )}
            </button>
          </div>

          {/* Upload Progress */}
          {imageUploading && uploadProgress.total > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading images...</span>
                <span>
                  {uploadProgress.current}/{uploadProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-800">
                  Selected Images ({imagePreviews.length})
                </h3>
                <button
                  type="button"
                  onClick={handleRemoveAllImages}
                  className="text-sm text-red-600 hover:text-red-800 transition"
                >
                  Remove All
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden shadow-md border border-gray-200">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                    {cloudinaryUrls[index] && (
                      <div className="absolute bottom-2 left-2 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Messages */}
          {cloudinaryUrls.length > 0 && !imageUploading && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              {cloudinaryUrls.length} image(s) uploaded successfully
            </div>
          )}
          {imageUploadError && !imageUploading && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {imageUploadError}
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-2">
            Product Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title')}
            id="title"
            type="text"
            placeholder="Enter product title"
            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-semibold text-gray-800 mb-2">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            {...register('price')}
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter price"
            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-800 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register('categoryId')}
            id="category"
            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description')}
            id="description"
            rows={4}
            placeholder="Describe your product in detail..."
            className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">Location</label>
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => handleLocationToggle(true)}
              disabled={isLoading}
              className={`flex items-center px-4 py-2 rounded-lg border transition ${
                useCurrentLocation
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MapPin size={16} className="mr-2" />
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" /> Getting location...
                </>
              ) : (
                'Use Current Location'
              )}
            </button>
            <button
              type="button"
              onClick={() => handleLocationToggle(false)}
              className={`px-4 py-2 rounded-lg border transition ${
                !useCurrentLocation
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Enter Manually
            </button>
          </div>

          {useCurrentLocation && location && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 flex items-start">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              <div>
                <p className="font-medium">Current Location</p>
                <p>{location.address?.formatted || `${location.latitude}, ${location.longitude}`}</p>
              </div>
            </div>
          )}

          {!useCurrentLocation && (
            <input
              type="text"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              placeholder="Enter your location (e.g., City, State)"
              className="w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          )}

          {useCurrentLocation && !location && (
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
              className="mt-2 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" /> Getting location...
                </>
              ) : (
                <>
                  <MapPin size={16} className="mr-2" /> Get Current Location
                </>
              )}
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || imageUploading || cloudinaryUrls.length === 0}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center disabled:opacity-50"
          >
            {imageUploading ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4 mr-2" /> Uploading...
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
  </div>
);

};

export default AddProduct;
