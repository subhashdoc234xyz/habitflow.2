export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-[var(--bg-hover)] text-[var(--text-secondary)]',
    primary: 'bg-accent/20 text-accent-light',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-amber-500/20 text-amber-400',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
