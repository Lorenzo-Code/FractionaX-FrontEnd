import React from 'react';
import { cn } from '../../utils/cn';

const Checkbox = React.forwardRef(({ 
  className, 
  checked, 
  onCheckedChange,
  disabled,
  ...props 
}, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked || false);

  React.useEffect(() => {
    setIsChecked(checked || false);
  }, [checked]);

  const handleChange = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      disabled={disabled}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        isChecked 
          ? 'bg-gray-900 border-gray-900 text-gray-50' 
          : 'bg-white',
        className
      )}
      onClick={handleChange}
      {...props}
    >
      {isChecked && (
        <svg
          className="h-3 w-3 fill-current"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 3L4.5 8.5L2 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
