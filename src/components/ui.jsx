export function Button({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  className = ''
}) {
  const baseClasses = 'py-2 px-4 rounded-lg font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  const width = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${width} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

export function Input({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Spinner({ size = 'medium' }) {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8',
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizes[size]}`}></div>
  );
}

export function Avatar({ name, size = 'medium' }) {
  const sizes = {
    small: 'h-6 w-6 text-xs',
    medium: 'h-10 w-10 text-sm',
    large: 'h-12 w-12 text-base',
  };
  
  const initials = name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '?';
  
  return (
    <div className={`flex items-center justify-center rounded-full bg-blue-500 text-white ${sizes[size]}`}>
      {initials}
    </div>
  );
}
