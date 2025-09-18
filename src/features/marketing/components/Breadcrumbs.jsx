import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items, className = '' }) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `${window.location.origin}${item.href}` : undefined
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav className={`flex items-center space-x-1 text-sm text-gray-500 ${className}`} aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
                )}
                {item.href && !isLast ? (
                  <Link
                    to={item.href}
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    {index === 0 && item.icon && (
                      <Home className="w-4 h-4" />
                    )}
                    <span className="truncate max-w-[150px] sm:max-w-[200px]">
                      {item.label}
                    </span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 text-gray-900 font-medium">
                    {index === 0 && item.icon && (
                      <Home className="w-4 h-4" />
                    )}
                    <span className="truncate max-w-[150px] sm:max-w-[200px]">
                      {item.label}
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
