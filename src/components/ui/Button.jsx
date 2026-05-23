import { forwardRef } from 'react';

const variants = {
  primary: 'bg-accent hover:bg-accent-light text-white shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] border border-accent-light/50',
  secondary: 'glass hover:bg-[var(--bg-hover)] text-[var(--text-primary)] hover:border-accent/50 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]',
  ghost: 'hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  danger: 'bg-red-600/80 hover:bg-red-500 text-white border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
  success: 'bg-green-600/80 hover:bg-green-500 text-white border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

const Button = forwardRef(({ variant = 'primary', size = 'md', className = '', loading = false, disabled, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
