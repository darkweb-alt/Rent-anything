
import React from 'react';

interface InputProps {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  required?: boolean;
  maxLength?: number;
  pattern?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ id, type, value, onChange, placeholder, label, required = false, error, ...props }) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
        className={`
          w-full px-4 py-3
          bg-white border-2 
          text-gray-900 rounded-lg
          transition-colors duration-300
          focus:outline-none focus:ring-2 focus:ring-red-500
          placeholder-gray-400
          ${error ? 'border-red-500' : 'border-gray-300 focus:border-red-500'}
        `}
      />
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
