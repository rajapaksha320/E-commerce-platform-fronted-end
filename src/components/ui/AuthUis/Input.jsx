import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const Input = ({
  type = "text",
  label,
  name,
  value,
  onChange,
  placeholder = "",
  error = "",
  className = "",
  required = false,
  disabled = false,
  icon = null,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={`w-full mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-semibold mb-2 text-blue-800"
        >
          {label} {required && <span className="text-blue-600">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
              disabled ? "text-gray-400" : "text-blue-600"
            }`}
          >
            {icon}
          </div>
        )}
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 border rounded-xl font-medium text-gray-800 placeholder-gray-500
            ${icon ? "pl-10" : ""}
            ${type === "password" ? "pr-10" : ""}
            transition-all duration-300 outline-none bg-white/80 backdrop-blur-sm
            ${
              disabled
                ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
                : error
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : isFocused
                ? "border-blue-600 focus:ring-2 focus:ring-blue-200"
                : "border-gray-300"
            }
          `}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
              disabled ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
            }`}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  );
};
