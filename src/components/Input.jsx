import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-300 ml-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`input-field ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' : ''}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 ml-1">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
