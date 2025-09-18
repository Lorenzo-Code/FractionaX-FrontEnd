import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LayoutControlWrapper - Prevents page jumping from expanding content
 * 
 * This wrapper maintains consistent layout by:
 * 1. Measuring the maximum height of expanded content
 * 2. Setting a fixed container height to prevent layout shifts
 * 3. Providing smooth transitions within the fixed space
 */
const LayoutControlWrapper = ({ 
  children, 
  className = "",
  minHeight = "auto",
  maxHeight = "none",
  transition = { duration: 0.3, ease: "easeInOut" }
}) => {
  const [containerHeight, setContainerHeight] = useState(minHeight);
  const contentRef = useRef(null);

  // Measure content height when it changes
  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const height = entry.contentRect.height;
          
          // Only update if height changed significantly (>10px) to avoid micro-adjustments
          if (Math.abs(height - (typeof containerHeight === 'number' ? containerHeight : 0)) > 10) {
            setContainerHeight(height);
          }
        }
      });

      resizeObserver.observe(contentRef.current);
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [containerHeight]);

  return (
    <motion.div 
      className={`overflow-hidden ${className}`}
      style={{
        height: containerHeight,
        minHeight,
        maxHeight
      }}
      animate={{ height: containerHeight }}
      transition={transition}
    >
      <div ref={contentRef} className="w-full">
        {children}
      </div>
    </motion.div>
  );
};

/**
 * ExpandableSection - For sections with show/hide content
 */
export const ExpandableSection = ({ 
  isExpanded, 
  children, 
  className = "",
  collapsedHeight = "auto",
  transition = { duration: 0.3, ease: "easeInOut" }
}) => {
  const contentRef = useRef(null);
  const [expandedHeight, setExpandedHeight] = useState('auto');

  useEffect(() => {
    if (contentRef.current && isExpanded) {
      setExpandedHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded, children]);

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      animate={{
        height: isExpanded ? expandedHeight : collapsedHeight
      }}
      transition={transition}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </motion.div>
  );
};

/**
 * TabSection - For tabbed content that changes
 */
export const TabSection = ({
  activeContent,
  tabs,
  className = "",
  minHeight = 400,
  transition = { duration: 0.3, ease: "easeInOut" }
}) => {
  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ minHeight }}
      animate={{ height: minHeight }}
      transition={transition}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={transition}
          className="absolute inset-0"
        >
          {tabs[activeContent]}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

/**
 * CardGrid - For card layouts that might expand
 */
export const CardGrid = ({ 
  children, 
  className = "",
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  gap = "gap-6",
  minCardHeight = "300px"
}) => {
  return (
    <div className={`grid ${gridCols} ${gap} ${className}`}>
      {React.Children.map(children, (child, index) => (
        <motion.div 
          key={index}
          style={{ minHeight: minCardHeight }}
          className="flex flex-col"
          layout
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

export default LayoutControlWrapper;
