import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  disabled = false,
  type = "button",
  onClick,
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-white",
    ghost: "text-blue-600 hover:bg-blue-50 bg-transparent",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };

  const sizes = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2.5 px-4 text-base",
    lg: "py-3 px-6 text-lg",
    xl: "py-4 px-8 text-xl",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`
        ${sizes[size]} 
        rounded-xl font-semibold transition-all duration-300 
        outline-none transform hover:scale-105
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${variants[variant]}
        ${className}
      `}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
