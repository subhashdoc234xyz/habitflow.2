import React from 'react';
import { cn } from '../utils/cn';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function PrimaryButton({ children, className, ...props }: PrimaryButtonProps) {
  return (
    <button className={cn("btn-primary", className)} {...props}>
      {children}
    </button>
  );
}
