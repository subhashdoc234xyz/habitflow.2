import { forwardRef } from 'react';

const variants = {
  primary: 'bg-gradient-to-r from-[#ec4899] via-[#a78bfa] to-[#38bdf8] text-white border border-white/25 shadow-[0_4px_20px_rgba(236,72,153,0.35)] hover:shadow-[0_8px_30px_rgba(56,189,248,0.65)]',
  secondary: 'glass bg-white/[0.04] border border-white/[0.18] text-white hover:bg-white/[0.08] hover:border-[#38bdf8] hover:shadow-[0_4px_20px_rgba(56,189,248,0.25)]',
  ghost: 'hover:bg-white/[0.04] border border-transparent hover:border-white/10 text-[var(--text-secondary)] hover:text-white',
  danger: 'bg-gradient-to-r from-red-500 to-[#e11d48] text-white border border-white/20 shadow-[0_4px_20px_rgba(239,68,68,0.3)]',
  success: 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white border border-white/20 shadow-[0_4px_20px_rgba(16,185,129,0.3)]',
};

const sizes = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
  xl: 'px-9 py-4 text-lg',
};

const Button = forwardRef(({ variant = 'primary', size = 'md', className = '', loading = false, disabled, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)
        disabled:opacity-50 disabled:cursor-not-allowed
        transform hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.97]
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
