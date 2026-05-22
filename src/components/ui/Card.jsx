export default function Card({ children, className = '', hover = true, glow = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${glow ? 'glow-accent' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
