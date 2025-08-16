import React from 'react';
import { cn } from '../../utils/cn';
import { Label } from './label';

const FormField = ({
  children,
  label,
  error,
  success,
  required,
  description,
  className,
  ...props
}) => {
  const fieldId = React.useId();

  return (
    <div className={cn('space-y-2', className)} {...props}>
      {label && (
        <Label 
          htmlFor={fieldId}
          className={cn(
            required && "after:content-['*'] after:ml-0.5 after:text-red-500"
          )}
        >
          {label}
        </Label>
      )}
      
      {description && (
        <p className="text-sm text-gray-600">
          {description}
        </p>
      )}

      <div className="relative">
        {React.cloneElement(children, {
          id: fieldId,
          error: !!error,
          success: !!success && !error,
          'aria-invalid': !!error,
          'aria-describedby': error ? `${fieldId}-error` : undefined,
          ...children.props
        })}
        
        {/* Validation icons */}
        {(error || success) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {error && (
              <svg
                className="h-4 w-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {success && !error && (
              <svg
                className="h-4 w-4 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {error && (
        <p 
          id={`${fieldId}-error`}
          className="text-sm text-red-600 flex items-center"
          role="alert"
        >
          <svg
            className="h-4 w-4 mr-1 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}

      {success && !error && (
        <p className="text-sm text-green-600 flex items-center">
          <svg
            className="h-4 w-4 mr-1 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {typeof success === 'string' ? success : 'Valid'}
        </p>
      )}
    </div>
  );
};

export { FormField };
