import { smartFetch } from '../shared/utils/secureApiClient';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Upload a single image to the blog images API
 * @param {File} file - Image file to upload
 * @param {Object} options - Upload options
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Upload result
 */
export const uploadBlogImage = async (file, options = {}, onProgress = null) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    // Add processing options
    if (options.maxWidth) formData.append('maxWidth', options.maxWidth);
    if (options.maxHeight) formData.append('maxHeight', options.maxHeight);
    if (options.quality) formData.append('quality', options.quality);
    if (options.format) formData.append('format', options.format);

    const response = await fetch(`${API_BASE_URL}/api/blog-images/upload`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let browser set it with boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    return result;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Upload multiple images to the blog images API
 * @param {FileList|File[]} files - Array of image files to upload
 * @param {Object} options - Upload options
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Upload result
 */
export const uploadMultipleBlogImages = async (files, options = {}, onProgress = null) => {
  try {
    const formData = new FormData();
    
    // Add all files
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });
    
    // Add processing options
    if (options.maxWidth) formData.append('maxWidth', options.maxWidth);
    if (options.maxHeight) formData.append('maxHeight', options.maxHeight);
    if (options.quality) formData.append('quality', options.quality);
    if (options.format) formData.append('format', options.format);

    const response = await fetch(`${API_BASE_URL}/api/blog-images/upload-multiple`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Upload failed');
    }

    return result;
  } catch (error) {
    console.error('Multiple images upload error:', error);
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};

/**
 * Upload image from URL
 * @param {string} url - Image URL to upload
 * @param {string} filename - Optional custom filename
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result
 */
export const uploadImageFromUrl = async (url, filename = null, options = {}) => {
  try {
    const payload = {
      url,
      filename,
      ...options
    };

    const result = await smartFetch('/api/blog-images/upload-from-url', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (!result.success) {
      throw new Error(result.error || 'Upload from URL failed');
    }

    return result;
  } catch (error) {
    console.error('URL image upload error:', error);
    throw new Error(`Failed to upload image from URL: ${error.message}`);
  }
};

/**
 * Get list of uploaded blog images
 * @param {number} page - Page number
 * @param {number} limit - Images per page
 * @returns {Promise<Object>} Images list
 */
export const getBlogImages = async (page = 1, limit = 20) => {
  try {
    const result = await smartFetch(`/api/blog-images?page=${page}&limit=${limit}`);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch images');
    }

    return result;
  } catch (error) {
    console.error('Error fetching blog images:', error);
    throw new Error(`Failed to fetch images: ${error.message}`);
  }
};

/**
 * Delete a blog image
 * @param {string} filename - Image filename to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteBlogImage = async (filename) => {
  try {
    const result = await smartFetch(`/api/blog-images/${filename}`, {
      method: 'DELETE'
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete image');
    }

    return result;
  } catch (error) {
    console.error('Error deleting blog image:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Get image information
 * @param {string} filename - Image filename
 * @returns {Promise<Object>} Image info
 */
export const getBlogImageInfo = async (filename) => {
  try {
    const result = await smartFetch(`/api/blog-images/${filename}`);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get image info');
    }

    return result;
  } catch (error) {
    console.error('Error getting blog image info:', error);
    throw new Error(`Failed to get image info: ${error.message}`);
  }
};

/**
 * Convert File to base64 (fallback for preview)
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 data URL
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Check if URL is an image
 * @param {string} url - URL to check
 * @returns {Promise<boolean>} True if URL is an image
 */
export const isImageUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return contentType && contentType.startsWith('image/');
  } catch (error) {
    return false;
  }
};

/**
 * Process image files with validation
 * @param {FileList|File[]} files - Files to process
 * @param {Object} options - Processing options
 * @returns {Object} Processed files info
 */
export const processImageFiles = (files, options = {}) => {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    maxFiles = 10
  } = options;

  const fileArray = Array.from(files);
  const validFiles = [];
  const errors = [];

  // Check file count
  if (fileArray.length > maxFiles) {
    errors.push(`Too many files. Maximum ${maxFiles} files allowed.`);
    return { validFiles: [], errors, hasErrors: true };
  }

  fileArray.forEach((file, index) => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${index + 1}: Invalid file type. Only images are allowed.`);
      return;
    }

    // Check file size
    if (file.size > maxFileSize) {
      errors.push(`File ${index + 1}: File too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB.`);
      return;
    }

    validFiles.push(file);
  });

  return {
    validFiles,
    errors,
    hasErrors: errors.length > 0,
    summary: {
      total: fileArray.length,
      valid: validFiles.length,
      invalid: errors.length
    }
  };
};

export default {
  uploadBlogImage,
  uploadMultipleBlogImages,
  uploadImageFromUrl,
  getBlogImages,
  deleteBlogImage,
  getBlogImageInfo,
  fileToBase64,
  isImageUrl,
  processImageFiles
};