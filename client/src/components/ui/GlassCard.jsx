export default function GlassCard({ 
  children, 
  className = '', 
  glow = false,
  hover = true,
  onClick 
}) {
  return (
    <div 
      onClick={onClick}
      className={`
        glass rounded-2xl p-6 
        ${hover ? 'glass-hover' : ''} 
        ${glow ? 'glass-card-glow' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
}
