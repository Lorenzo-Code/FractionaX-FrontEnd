import React from 'react';

export const Alert = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'border-gray-200 bg-gray-50 text-gray-900',
    destructive: 'border-red-200 bg-red-50 text-red-900',
    success: 'border-green-200 bg-green-50 text-green-900',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
  };

  return (
    <div 
      className={`border rounded-lg p-4 ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className = '', ...props }) => {
  return (
    <div className={`text-sm mt-1 ${className}`} {...props}>
      {children}
    </div>
  );
};
