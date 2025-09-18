import React, { useEffect, useState } from 'react';
import { List, ChevronRight } from 'lucide-react';

const TableOfContents = ({ content, className = '' }) => {
  const [headings, setHeadings] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (!content) return;

    // Extract headings from HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4');
    const extractedHeadings = Array.from(headingElements).map((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent?.trim() || '';
      const id = heading.id || `heading-${index}`;
      
      // If heading doesn't have an id, we'll need to add one when rendering
      if (!heading.id) {
        heading.id = id;
      }

      return {
        id,
        text,
        level,
        element: heading
      };
    });

    setHeadings(extractedHeadings);

    // Set up intersection observer to track active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66% 0px',
        threshold: 0
      }
    );

    // Observe all headings in the actual DOM
    setTimeout(() => {
      extractedHeadings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => {
      observer.disconnect();
    };
  }, [content]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-xl ${className}`}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 rounded-t-xl"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <List className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Table of Contents</h3>
        </div>
        <ChevronRight 
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isExpanded ? 'rotate-90' : ''
          }`} 
        />
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          <nav className="space-y-1">
            {headings.map((heading, index) => (
              <button
                key={`${heading.id}-${index}`}
                onClick={() => scrollToHeading(heading.id)}
                className={`block w-full text-left py-2 px-3 text-sm rounded transition-all duration-200 ${
                  activeHeading === heading.id
                    ? 'bg-blue-100 text-blue-700 font-medium border-l-3 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                style={{
                  paddingLeft: `${12 + (heading.level - 1) * 16}px`
                }}
              >
                <span className="block truncate">
                  {heading.text}
                </span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

// Hook to add IDs to headings in rendered content
export const useHeadingIds = (content) => {
  useEffect(() => {
    if (!content) return;

    setTimeout(() => {
      const headings = document.querySelectorAll('article h1, article h2, article h3, article h4');
      headings.forEach((heading, index) => {
        if (!heading.id) {
          const text = heading.textContent?.trim() || '';
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim() || `heading-${index}`;
          
          heading.id = id;
        }
      });
    }, 100);
  }, [content]);
};

export default TableOfContents;
