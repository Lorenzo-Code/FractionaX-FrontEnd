import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const PhotoSlider = ({ images, propertyTitle = "Property Photos" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const sliderRef = useRef(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') previousImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen, currentIndex]);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const previousImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // Touch/Mouse event handlers for swipe gestures
  const handleStart = (e) => {
    setIsDragging(true);
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    setStartX(clientX);
    setTranslateX(0);
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50; // Minimum swipe distance (reduced for better responsiveness)
    
    if (translateX > threshold) {
      previousImage();
    } else if (translateX < -threshold) {
      nextImage();
    }
    
    setTranslateX(0);
  };

  // Auto-advance slider (optional)
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      if (!isDragging && !isFullscreen) {
        nextImage();
      }
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [nextImage, isDragging, isFullscreen, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  return (
    <>
      {/* Main Slider */}
      <div className="relative bg-white rounded-lg shadow-sm overflow-hidden mb-4 sm:mb-6">
        {/* Slider Container */}
        <div
          ref={sliderRef}
          className={`relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden transition-transform duration-200 ${
            isDragging ? 'cursor-grabbing scale-[0.98]' : 'cursor-grab hover:scale-[1.01]'
          }`}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          {/* Single Image Display with Smooth Transitions */}
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`${propertyTitle} - Photo ${currentIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover select-none"
                draggable={false}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x600?text=Image+Not+Found";
                }}
              />
            </AnimatePresence>
            
            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-lg transition-all duration-200 z-20"
              aria-label="View fullscreen"
            >
              <FiMaximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 z-20 hover:scale-110"
                aria-label="Previous image"
              >
                <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 sm:p-3 rounded-full shadow-lg transition-all duration-200 z-20 hover:scale-110"
                aria-label="Next image"
              >
                <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm sm:text-base font-medium z-20">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Dot Indicators - Limited for mobile */}
        {images.length > 1 && (
          <div className="flex justify-center space-x-2 p-4 bg-white">
            {images.length <= 10 ? (
              // Show all dots if 10 or fewer images
              images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-blue-500 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))
            ) : (
              // Show current position indicator for many images
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-600 font-medium">
                  {currentIndex + 1} of {images.length}
                </div>
                <div className="flex space-x-1">
                  {[...Array(Math.min(5, images.length))].map((_, index) => {
                    const imageIndex = Math.floor((currentIndex / images.length) * 5);
                    return (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === imageIndex
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Thumbnail Strip (Alternative to dots for desktop) */}
        {images.length > 1 && (
          <div className="hidden sm:block p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {images.slice(0, 8).map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? 'border-blue-500 scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                    }}
                  />
                </button>
              ))}
              {images.length > 8 && (
                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-200 border-2 border-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-600 font-medium">+{images.length - 8}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <div className="relative max-w-screen-xl max-h-screen w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-60 bg-black bg-opacity-50 rounded-full p-2"
                aria-label="Close fullscreen"
              >
                <FiX className="w-6 h-6" />
              </button>

              {/* Fullscreen Image */}
              <motion.img
                key={currentIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={images[currentIndex]}
                alt={`${propertyTitle} - Photo ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Fullscreen Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      previousImage();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3"
                    aria-label="Previous image"
                  >
                    <FiChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-3"
                    aria-label="Next image"
                  >
                    <FiChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Fullscreen Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-medium bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PhotoSlider;