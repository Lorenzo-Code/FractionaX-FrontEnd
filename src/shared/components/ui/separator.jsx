import React from 'react';
import { cn } from '../../utils/cn';

const Separator = React.forwardRef(({ 
  className, 
  orientation = 'horizontal', 
  decorative = true,
  ...props 
}, ref) => (
  <div
    ref={ref}
    role={!decorative ? 'separator' : undefined}
    aria-orientation={orientation}
    className={cn(
      'shrink-0 bg-gray-200',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className
    )}
    {...props}
  />
));

Separator.displayName = 'Separator';

export { Separator };
