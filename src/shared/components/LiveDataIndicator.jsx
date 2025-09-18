import React from 'react';
import { motion } from 'framer-motion';

/**
 * LiveDataIndicator Component
 * Shows whether data is live (real-time) or manually set (static)
 * 
 * @param {boolean} isLive - Whether the data is from live sources
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {string} position - Position variant: 'inline', 'corner', 'floating'
 * @param {string} lastUpdated - ISO string of when data was last updated
 * @param {boolean} showTimestamp - Whether to show the last updated time
 * @param {string} className - Additional CSS classes
 */
const LiveDataIndicator = ({ 
  isLive = true, 
  size = 'sm', 
  position = 'inline',
  lastUpdated = null,
  showTimestamp = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3', 
    lg: 'w-4 h-4'
  };

  const positionClasses = {
    inline: '',
    corner: 'absolute top-2 right-2',
    floating: 'absolute top-3 right-3 z-10'
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const baseClasses = `
    inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200
    ${sizeClasses[size]}
    ${positionClasses[position]}
    ${className}
  `;

  if (isLive) {
    return (
      <motion.div 
        className={`${baseClasses} bg-green-50 text-green-700 border border-green-200`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        title={showTimestamp && lastUpdated ? `Last updated: ${formatTimestamp(lastUpdated)}` : 'Live data - updates automatically'}
      >
        <motion.div 
          className={`bg-green-500 rounded-full ${iconSizes[size]}`}
          animate={{ 
            boxShadow: [
              '0 0 0 0 rgba(34, 197, 94, 0.7)',
              '0 0 0 4px rgba(34, 197, 94, 0)',
              '0 0 0 0 rgba(34, 197, 94, 0)'
            ]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop'
          }}
        />
        <span>Live</span>
        {showTimestamp && lastUpdated && (
          <span className="text-green-600 ml-1">
            • {formatTimestamp(lastUpdated)}
          </span>
        )}
      </motion.div>
    );
  } else {
    return (
      <div 
        className={`${baseClasses} bg-orange-50 text-orange-700 border border-orange-200`}
        title={showTimestamp && lastUpdated ? `Last updated: ${formatTimestamp(lastUpdated)}` : 'Manual data - set by admin'}
      >
        <div className={`bg-orange-500 rounded-full ${iconSizes[size]}`} />
        <span>Manual</span>
        {showTimestamp && lastUpdated && (
          <span className="text-orange-600 ml-1">
            • {formatTimestamp(lastUpdated)}
          </span>
        )}
      </div>
    );
  }
};

export default LiveDataIndicator;
