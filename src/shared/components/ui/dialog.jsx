import React from 'react';
import { cn } from '../../utils/cn';

// Dialog Context for sharing state
const DialogContext = React.createContext({});

// Focus trap hook
const useFocusTrap = (isOpen, containerRef) => {
  React.useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element when dialog opens
    const focusElement = container.querySelector('[data-dialog-focus]') || firstElement;
    focusElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen, containerRef]);
};

const Dialog = ({ children, open, onOpenChange, ...props }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const containerRef = React.useRef(null);
  const previousActiveElement = React.useRef(null);

  // Focus trap
  useFocusTrap(open, containerRef);

  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onOpenChange?.(false);
      }
    };
    
    if (open) {
      previousActiveElement.current = document.activeElement;
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
    } else {
      // Restore focus when closing
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  const contextValue = {
    open,
    onOpenChange,
    isAnimating
  };

  if (!open && !isAnimating) return null;

  return (
    <DialogContext.Provider value={contextValue}>
      <div 
        className="fixed inset-0 z-50"
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {/* Backdrop */}
        <div 
          className={cn(
            'fixed inset-0 bg-black/50 transition-opacity duration-200',
            open ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => onOpenChange?.(false)}
          onAnimationEnd={() => !open && setIsAnimating(false)}
        />
        {/* Dialog content */}
        <div 
          ref={containerRef}
          className="fixed inset-0 flex items-center justify-center p-4"
        >
          {React.Children.map(children, child =>
            React.cloneElement(child, { onOpenChange })
          )}
        </div>
      </div>
    </DialogContext.Provider>
  );
};

const DialogTrigger = ({ children, asChild, ...props }) => {
  return React.cloneElement(children, props);
};

const DialogContent = React.forwardRef(({ 
  className, 
  children, 
  onOpenChange,
  ...props 
}, ref) => {
  const { open } = React.useContext(DialogContext);

  return (
    <div
      ref={ref}
      className={cn(
        'relative bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-lg mx-auto max-h-[85vh] overflow-auto transition-all duration-200 transform',
        open 
          ? 'scale-100 opacity-100 translate-y-0' 
          : 'scale-95 opacity-0 translate-y-2',
        className
      )}
      onClick={e => e.stopPropagation()}
      {...props}
    >
      {/* Close button */}
      <button
        type="button"
        data-dialog-focus
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none z-10"
        onClick={() => onOpenChange?.(false)}
        aria-label="Close dialog"
      >
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <span className="sr-only">Close</span>
      </button>
      {children}
    </div>
  );
});
DialogContent.displayName = 'DialogContent';

const DialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0', className)}
    {...props}
  />
));
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0', className)}
    {...props}
  />
));
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-500', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
