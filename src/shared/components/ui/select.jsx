import React from 'react';
import { cn } from '../../utils/cn';

// Context for managing select state
const SelectContext = React.createContext({});

const Select = ({ children, value, onValueChange, disabled, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || '');
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const triggerRef = React.useRef(null);

  React.useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  const contextValue = {
    isOpen,
    setIsOpen,
    selectedValue,
    setSelectedValue,
    highlightedIndex,
    setHighlightedIndex,
    onValueChange,
    disabled,
    triggerRef
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => {
  const { 
    isOpen, 
    setIsOpen, 
    selectedValue, 
    disabled,
    triggerRef,
    setHighlightedIndex
  } = React.useContext(SelectContext);

  const handleKeyDown = (e) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
        break;
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
        }
        break;
    }
  };

  const handleClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setHighlightedIndex(0);
      }
    }
  };

  React.useImperativeHandle(ref, () => triggerRef.current);
  
  return (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      disabled={disabled}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
      <svg
        className={cn(
          'h-4 w-4 opacity-50 transition-transform',
          isOpen && 'rotate-180'
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = ({ placeholder }) => {
  const { selectedValue } = React.useContext(SelectContext);
  
  return (
    <span className={cn(!selectedValue && 'text-gray-500')}>
      {selectedValue || placeholder}
    </span>
  );
};

const SelectContent = React.forwardRef(({ 
  className, 
  children,
  ...props 
}, ref) => {
  const { 
    isOpen, 
    setIsOpen, 
    highlightedIndex, 
    setHighlightedIndex,
    triggerRef
  } = React.useContext(SelectContext);
  
  const contentRef = React.useRef(null);
  const itemRefs = React.useRef([]);
  
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen, triggerRef]);

  React.useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex].scrollIntoView({
        block: 'nearest'
      });
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e) => {
    const itemCount = React.Children.count(children);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < itemCount - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : itemCount - 1
        );
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
          itemRefs.current[highlightedIndex].click();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      role="listbox"
      className={cn(
        'absolute top-full left-0 right-0 z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md',
        className
      )}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      {...props}
    >
      <div className="p-1 max-h-60 overflow-auto">
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            ref: (el) => itemRefs.current[index] = el,
            isHighlighted: index === highlightedIndex,
            index
          });
        })}
      </div>
    </div>
  );
});
SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef(({ 
  className, 
  children, 
  value,
  disabled,
  isHighlighted,
  ...props 
}, ref) => {
  const { 
    selectedValue,
    setSelectedValue,
    setIsOpen,
    onValueChange,
    triggerRef
  } = React.useContext(SelectContext);

  const handleClick = () => {
    if (disabled) return;
    
    setSelectedValue(value);
    onValueChange?.(value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const isSelected = selectedValue === value;

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
        isHighlighted && 'bg-gray-100',
        isSelected && 'bg-gray-100 font-medium',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg
            className="h-4 w-4"
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
        </span>
      )}
      {children}
    </div>
  );
});
SelectItem.displayName = 'SelectItem';

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
