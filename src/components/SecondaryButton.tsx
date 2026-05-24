import React from 'react';
import { cn } from '../utils/cn';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function SecondaryButton({ children, className, ...props }: SecondaryButtonProps) {
  return (
    <button className={cn("btn-secondary", className)} {...props}>
      {children}
    </button>
  );
}
