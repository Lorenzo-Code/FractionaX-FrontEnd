import React from 'react';
import { cn } from '../../utils/cn';

const Button = ({
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-gray-900 text-gray-50 hover:bg-gray-900/90 active:bg-gray-900/95',
    destructive: 'bg-red-500 text-gray-50 hover:bg-red-500/90 active:bg-red-500/95',
    outline: 'border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-100/80 active:bg-gray-200',
    ghost: 'hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200',
    link: 'text-gray-900 underline-offset-4 hover:underline active:text-gray-700',
  };

  const sizes = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-8 px-3 py-1.5 text-xs',
    lg: 'h-12 px-8 py-3 text-base',
    icon: 'h-10 w-10 p-0',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-white transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'transform active:scale-[0.98]',
        variants[variant],
        sizes[size],
        loading && 'cursor-not-allowed',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
};

export { Button };
