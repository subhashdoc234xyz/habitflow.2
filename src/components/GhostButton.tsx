import React from 'react';
import { cn } from '../utils/cn';

interface GhostButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function GhostButton({ children, className, ...props }: GhostButtonProps) {
  return (
    <button className={cn("btn-ghost", className)} {...props}>
      {children}
    </button>
  );
}
