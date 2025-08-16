import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ 
  className, 
  type, 
  error,
  success,
  disabled,
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const getVariantStyles = () => {
    if (error) {
      return 'border-red-300 focus-visible:ring-red-400 focus-visible:border-red-400';
    }
    if (success) {
      return 'border-green-300 focus-visible:ring-green-400 focus-visible:border-green-400';
    }
    return 'border-gray-300 focus-visible:ring-gray-400 focus-visible:border-gray-400';
  };

  return (
    <input
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white transition-colors',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-gray-500',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
        getVariantStyles(),
        isFocused && 'ring-2 ring-offset-2',
        className
      )}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
