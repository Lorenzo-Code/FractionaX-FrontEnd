import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Copy, 
  Check, 
  X, 
  Search,
  Filter,
  Grid,
  List,
  RefreshCw,
  AlertCircle,
  FileImage
} from 'lucide-react';
import { 
  getBlogImages, 
  uploadBlogImage, 
  uploadMultipleBlogImages, 
  deleteBlogImage,
  processImageFiles 
} from '../../../../services/blogImageService';

const ImageGallery = ({ 
  isOpen, 
  onClose, 
  onImageSelect, 
  onImageInsert,
  allowMultiple = false 
}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [copiedUrl, setCopiedUrl] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  // Load images when gallery opens
  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen, currentPage]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getBlogImages(currentPage, 20);
      setImages(result.images);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error loading images:', error);
      setError('Failed to load images: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (files) => {
    const processed = processImageFiles(files, {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5
    });

    if (processed.hasErrors) {
      setError(processed.errors.join('\n'));
      return;
    }

    if (processed.validFiles.length === 0) {
      setError('No valid image files selected');
      return;
    }

    try {
      setUploading(true);
      setError('');

      if (processed.validFiles.length === 1) {
        const result = await uploadBlogImage(processed.validFiles[0], {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 85
        });
        
        if (result.success) {
          // Add new image to the beginning of the list
          setImages(prev => [result.image, ...prev]);
        }
      } else {
        const result = await uploadMultipleBlogImages(processed.validFiles, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 85
        });
        
        if (result.success) {
          // Add new images to the beginning of the list
          setImages(prev => [...result.images, ...prev]);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleImageSelect = (image) => {
    if (allowMultiple) {
      setSelectedImages(prev => {
        const isSelected = prev.find(img => img.id === image.id);
        if (isSelected) {
          return prev.filter(img => img.id !== image.id);
        } else {
          return [...prev, image];
        }
      });
    } else {
      setSelectedImages([image]);
      if (onImageSelect) {
        onImageSelect(image);
      }
    }
  };

  const handleInsertImages = () => {
    if (selectedImages.length > 0 && onImageInsert) {
      onImageInsert(selectedImages);
      setSelectedImages([]);
      onClose();
    }
  };

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(''), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleDeleteImage = async (image) => {
    if (window.confirm(`Are you sure you want to delete "${image.filename}"?`)) {
      try {
        await deleteBlogImage(image.filename);
        setImages(prev => prev.filter(img => img.filename !== image.filename));
        setSelectedImages(prev => prev.filter(img => img.id !== image.id));
      } catch (error) {
        console.error('Delete error:', error);
        setError('Failed to delete image: ' + error.message);
      }
    }
  };

  const filteredImages = images.filter(image =>
    image.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Image Gallery</h2>
            </div>
            {selectedImages.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {selectedImages.length} selected
              </span>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {/* File Upload */}
            <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              Upload Images
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                disabled={uploading}
              />
            </label>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={loadImages}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-red-700 text-sm whitespace-pre-line">{error}</div>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 ml-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`m-4 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            Drag and drop images here, or{' '}
            <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
              browse to select
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
                disabled={uploading}
              />
            </label>
          </p>
          <p className="text-sm text-gray-500">
            Supports JPEG, PNG, GIF, WebP up to 10MB each
          </p>
          {uploading && (
            <div className="mt-4">
              <div className="text-blue-600">Uploading images...</div>
            </div>
          )}
        </div>

        {/* Images Grid/List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading images...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <ImageIcon className="w-16 h-16 mb-4" />
              <h3 className="text-lg font-medium mb-2">No images found</h3>
              <p className="text-sm">Upload some images to get started</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredImages.map((image) => {
                const isSelected = selectedImages.find(img => img.id === image.id);
                return (
                  <motion.div
                    key={image.id}
                    layout
                    className={`group relative bg-white border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.thumbnailUrl || image.url}
                        alt={image.alt || image.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(image.url);
                          }}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                          title="Copy URL"
                        >
                          {copiedUrl === image.url ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-700" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image);
                          }}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50"
                          title="Delete image"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    )}

                    {/* Image info */}
                    <div className="p-2">
                      <div className="text-xs text-gray-500 truncate" title={image.filename}>
                        {image.filename}
                      </div>
                      <div className="text-xs text-gray-400">
                        {image.width} × {image.height}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            // List view
            <div className="space-y-2">
              {filteredImages.map((image) => {
                const isSelected = selectedImages.find(img => img.id === image.id);
                return (
                  <motion.div
                    key={image.id}
                    layout
                    className={`flex items-center gap-4 p-3 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <img
                      src={image.thumbnailUrl || image.url}
                      alt={image.alt || image.filename}
                      className="w-16 h-16 object-cover rounded"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {image.filename}
                      </div>
                      <div className="text-sm text-gray-500">
                        {image.width} × {image.height} • {Math.round(image.size / 1024)}KB
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(image.url);
                        }}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Copy URL"
                      >
                        {copiedUrl === image.url ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(image);
                        }}
                        className="p-2 hover:bg-red-50 rounded transition-colors"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {filteredImages.length} images {searchQuery && `(filtered from ${images.length})`}
          </div>
          
          <div className="flex items-center gap-3">
            {selectedImages.length > 0 && (
              <button
                onClick={handleInsertImages}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Insert {selectedImages.length} Image{selectedImages.length !== 1 ? 's' : ''}
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImageGallery;