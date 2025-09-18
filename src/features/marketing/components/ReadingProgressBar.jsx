import React, { useState, useEffect } from 'react';

const ReadingProgressBar = ({ target = 'article', className = '' }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      // Find the target element (article content)
      const targetElement = document.querySelector(target) || document.querySelector('article') || document.body;
      
      if (!targetElement) return;

      const rect = targetElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const documentHeight = targetElement.offsetHeight;
      
      // Calculate how much of the article has been scrolled past
      const scrollTop = window.scrollY;
      const targetTop = targetElement.offsetTop;
      
      // Progress calculation
      const scrolled = Math.max(0, scrollTop - targetTop + windowHeight * 0.25); // Start progress when 25% into viewport
      const totalScrollable = Math.max(1, documentHeight - windowHeight * 0.5); // Account for viewport
      
      const progressPercentage = Math.min(100, Math.max(0, (scrolled / totalScrollable) * 100));
      
      setProgress(progressPercentage);
    };

    // Update progress on scroll
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    
    // Initial calculation
    setTimeout(updateProgress, 100); // Small delay to ensure DOM is ready

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [target]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div 
        className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-200 ease-out shadow-sm"
        style={{ 
          width: `${progress}%`,
          transformOrigin: 'left center'
        }}
      />
      {/* Optional: Add a subtle background for the progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -z-10" />
    </div>
  );
};

export default ReadingProgressBar;
