export default function Card({ children, className = '', hover = true, glow = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`
        glass rounded-xl p-5 relative overflow-hidden
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${glow ? 'glow-accent' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Optional shine effect for premium look */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {children}
    </div>
  );
}
