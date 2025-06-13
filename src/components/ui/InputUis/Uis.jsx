import React from "react";
import { Search } from "lucide-react";

// Base Input Component
export const Input = React.forwardRef(
  (
    {
      className = "",
      type = "text",
      size = "md",
      error = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-4 text-lg",
    };

    const baseClasses = `
    w-full border rounded-lg outline-none transition-all duration-200 bg-white
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    touch-manipulation
  `;

    const errorClasses = error
      ? "border-red-300 focus:ring-red-500"
      : "border-gray-300 hover:border-gray-400";

    return (
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${errorClasses} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

// SearchInput Component
export const SearchInput = React.forwardRef(
  (
    { placeholder = "Search...", className = "", size = "md", ...props },
    ref
  ) => {
    const containerSizeClasses = {
      sm: "text-sm",
      md: "text-sm",
      lg: "text-lg",
    };

    const iconSizeClasses = {
      sm: "h-4 w-4 left-3",
      md: "h-5 w-5 left-3",
      lg: "h-5 w-5 left-4",
    };

    const inputPaddingClasses = {
      sm: "pl-9",
      md: "pl-10",
      lg: "pl-12",
    };

    return (
      <div className={`relative ${containerSizeClasses[size]}`}>
        <Search
          className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSizeClasses[size]}`}
        />
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          size={size}
          className={`${inputPaddingClasses[size]} ${className}`}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

// Select Component
export const Select = React.forwardRef(
  (
    {
      options = [],
      placeholder = "Select...",
      className = "",
      size = "md",
      error = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-4 text-lg",
    };

    const baseClasses = `
    w-full border rounded-lg outline-none transition-all duration-200 bg-white
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    touch-manipulation appearance-none cursor-pointer
    bg-no-repeat bg-right bg-[length:16px_16px]
    bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")]
  `;

    const errorClasses = error
      ? "border-red-300 focus:ring-red-500"
      : "border-gray-300 hover:border-gray-400";

    const paddingClasses = {
      sm: "pr-8",
      md: "pr-8",
      lg: "pr-10",
    };

    return (
      <select
        ref={ref}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${paddingClasses[size]} ${errorClasses} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option key={option.value || index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = "Select";

// Textarea Component
export const Textarea = React.forwardRef(
  (
    {
      className = "",
      rows = 3,
      size = "md",
      error = false,
      disabled = false,
      resize = true,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-3 py-2 text-sm",
      lg: "px-4 py-4 text-lg",
    };

    const baseClasses = `
    w-full border rounded-lg outline-none transition-all duration-200 bg-white
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    touch-manipulation
  `;

    const errorClasses = error
      ? "border-red-300 focus:ring-red-500"
      : "border-gray-300 hover:border-gray-400";

    const resizeClasses = resize ? "resize-y" : "resize-none";

    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${errorClasses} ${resizeClasses} ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

// Form Group Component for labels and error messages
export const FormGroup = ({
  label,
  error,
  required = false,
  children,
  className = "",
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
};

// Checkbox Component
export const Checkbox = React.forwardRef(
  ({ label, className = "", size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };

    return (
      <label className={`flex items-center cursor-pointer ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          className={`${sizeClasses[size]} text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 touch-manipulation`}
          {...props}
        />
        {label && <span className="ml-2 text-sm text-gray-700">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

// Radio Component
export const Radio = React.forwardRef(
  ({ label, className = "", size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };

    return (
      <label className={`flex items-center cursor-pointer ${className}`}>
        <input
          ref={ref}
          type="radio"
          className={`${sizeClasses[size]} text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 touch-manipulation`}
          {...props}
        />
        {label && <span className="ml-2 text-sm text-gray-700">{label}</span>}
      </label>
    );
  }
);

Radio.displayName = "Radio";

// Switch/Toggle Component
export const Switch = React.forwardRef(
  (
    { label, className = "", size = "md", checked = false, onChange, ...props },
    ref
  ) => {
    const sizeClasses = {
      sm: "w-8 h-4",
      md: "w-10 h-5",
      lg: "w-12 h-6",
    };

    const thumbSizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };

    const translateClasses = {
      sm: checked ? "translate-x-4" : "translate-x-0.5",
      md: checked ? "translate-x-5" : "translate-x-0.5",
      lg: checked ? "translate-x-6" : "translate-x-0.5",
    };

    return (
      <label className={`flex items-center cursor-pointer ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only"
            {...props}
          />
          <div
            className={`
            ${sizeClasses[size]} 
            ${checked ? "bg-blue-600" : "bg-gray-300"}
            relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out
            focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
          `}
          >
            <div
              className={`
              ${thumbSizeClasses[size]}
              ${translateClasses[size]}
              inline-block bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out
            `}
            />
          </div>
        </div>
        {label && <span className="ml-3 text-sm text-gray-700">{label}</span>}
      </label>
    );
  }
);

Switch.displayName = "Switch";
