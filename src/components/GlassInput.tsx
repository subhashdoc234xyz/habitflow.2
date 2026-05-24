import React from 'react';
import { cn } from '../utils/cn';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add any custom props here if needed
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn("glass-input", className)}
        {...props}
      />
    );
  }
);

GlassInput.displayName = 'GlassInput';
