import * as React from "react";
import { cn } from "../../utils/cn";

const Progress = React.forwardRef(({ className, value, max = 100, ...props }, ref) => {
  const percentage = Math.min(Math.max((value || 0) / max * 100, 0), 100);
  
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-gray-200",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
