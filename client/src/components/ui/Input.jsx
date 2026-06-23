export default function Input({ 
  label, 
  error, 
  className = '', 
  ...props 
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        className={`glass-input ${error ? 'border-red-500/50 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
