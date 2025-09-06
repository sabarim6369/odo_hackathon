// Cloudinary configuration and upload utilities
// Configuration loaded from environment variables (.env file)
const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dcodzyruw",
  uploadPreset:
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "odoo_hackathon",
  apiKey: "your-api-key", // Optional for unsigned uploads
};

// Log config for debugging (remove in production)
console.log("Cloudinary Config:", {
  cloudName: CLOUDINARY_CONFIG.cloudName,
  uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
});

/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @param {Object} options - Additional upload options
 * @returns {Promise<Object>} - Upload result with image URL
 */
export const uploadImageToCloudinary = async (file, options = {}) => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 10MB");
    }

    // Create form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    formData.append("cloud_name", CLOUDINARY_CONFIG.cloudName);

    // Add optional parameters
    if (options.folder) {
      formData.append("folder", options.folder);
    }

    if (options.publicId) {
      formData.append("public_id", options.publicId);
    }

    // Add tags for organization
    formData.append("tags", "ecofinds,marketplace,product");

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const result = await response.json();

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      etag: result.etag,
      version: result.version,
      original: result,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {FileList|Array} files - Array of image files to upload
 * @param {Object} options - Additional upload options
 * @param {Function} onProgress - Progress callback (current, total)
 * @returns {Promise<Object>} - Upload results with array of image URLs
 */
export const uploadMultipleImagesToCloudinary = async (
  files,
  options = {},
  onProgress = null
) => {
  try {
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    const fileArray = Array.from(files);
    const results = [];
    const errors = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      // Call progress callback
      if (onProgress) {
        onProgress(i + 1, fileArray.length);
      }

      try {
        // Compress image before upload
        const compressedFile = await compressImage(file, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.8,
        });

        // Upload to Cloudinary with unique public ID
        const uploadResult = await uploadImageToCloudinary(compressedFile, {
          ...options,
          publicId: `${options.publicId || "product"}_${Date.now()}_${i}`,
        });

        if (uploadResult.success) {
          results.push(uploadResult);
        } else {
          errors.push({ file: file.name, error: uploadResult.error });
        }
      } catch (error) {
        errors.push({ file: file.name, error: error.message });
      }
    }

    return {
      success: results.length > 0,
      results,
      errors,
      totalUploaded: results.length,
      totalFiles: fileArray.length,
      urls: results.map((result) => result.url),
    };
  } catch (error) {
    console.error("Multiple upload error:", error);
    return {
      success: false,
      error: error.message,
      results: [],
      errors: [],
      totalUploaded: 0,
      totalFiles: 0,
      urls: [],
    };
  }
};

/**
 * Generate Cloudinary URL with transformations
 * @param {string} publicId - The public ID of the image
 * @param {Object} transformations - Transformation options
 * @returns {string} - Transformed image URL
 */
export const getCloudinaryUrl = (publicId, transformations = {}) => {
  if (!publicId) return "";

  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
    gravity = "auto",
    radius,
    effect,
  } = transformations;

  let transformString = [];

  if (width) transformString.push(`w_${width}`);
  if (height) transformString.push(`h_${height}`);
  if (crop) transformString.push(`c_${crop}`);
  if (quality) transformString.push(`q_${quality}`);
  if (format) transformString.push(`f_${format}`);
  if (gravity) transformString.push(`g_${gravity}`);
  if (radius) transformString.push(`r_${radius}`);
  if (effect) transformString.push(`e_${effect}`);

  const transforms =
    transformString.length > 0 ? `${transformString.join(",")}/` : "";

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transforms}${publicId}`;
};

/**
 * Generate responsive image URLs for different screen sizes
 * @param {string} publicId - The public ID of the image
 * @returns {Object} - Object with different sized URLs
 */
export const getResponsiveImageUrls = (publicId) => {
  if (!publicId) return {};

  return {
    thumbnail: getCloudinaryUrl(publicId, {
      width: 150,
      height: 150,
      crop: "fill",
    }),
    small: getCloudinaryUrl(publicId, {
      width: 300,
      height: 300,
      crop: "fill",
    }),
    medium: getCloudinaryUrl(publicId, {
      width: 600,
      height: 600,
      crop: "limit",
    }),
    large: getCloudinaryUrl(publicId, {
      width: 1200,
      height: 1200,
      crop: "limit",
    }),
    original: getCloudinaryUrl(publicId),
  };
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    // Note: Deletion requires authenticated requests with API secret
    // This is typically done on the backend for security
    console.warn(
      "Image deletion should be handled on the backend for security"
    );

    return {
      success: false,
      error: "Deletion not implemented - should be done on backend",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Compress and optimize image before upload
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = async (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1920,
      maxHeight = 1920,
      quality = 0.8,
      format = "jpeg",
    } = options;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: `image/${format}`,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error("Compression failed"));
          }
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

export default {
  uploadImageToCloudinary,
  getCloudinaryUrl,
  getResponsiveImageUrls,
  deleteImageFromCloudinary,
  compressImage,
};
