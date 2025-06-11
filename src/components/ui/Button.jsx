import React from "react";
import { Link } from "react-router-dom";

// Simple class merger utility - user classes override default classes
const mergeClasses = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  unstyled = false,
  href,
  external = false,
  ...props
}) => {
  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // If unstyled is true, only apply user classes
  if (unstyled) {
    const content = (
      <>
        {loading && <LoadingSpinner />}
        {children}
      </>
    );

    if (href) {
      const isExternal =
        external ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:");

      if (isExternal) {
        return (
          <a
            href={href}
            className={className}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            {...props}
          >
            {content}
          </a>
        );
      } else {
        return (
          <Link to={href} className={className} {...props}>
            {content}
          </Link>
        );
      }
    }

    return (
      <button className={className} disabled={disabled || loading} {...props}>
        {content}
      </button>
    );
  }

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed no-underline";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500",
    ghost:
      "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  // Merge classes - user className comes last to override defaults
  const elementClasses = mergeClasses(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  const content = (
    <>
      {loading && <LoadingSpinner />}
      {children}
    </>
  );

  // If href is provided, render as link
  if (href) {
    // Check if it's an external link
    const isExternal =
      external ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    if (isExternal) {
      // External link - use regular anchor tag
      return (
        <a
          href={href}
          className={elementClasses}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          {...props}
        >
          {content}
        </a>
      );
    } else {
      // Internal link - use React Router Link
      return (
        <Link to={href} className={elementClasses} {...props}>
          {content}
        </Link>
      );
    }
  }

  // No href - render as button
  return (
    <button
      className={elementClasses}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
