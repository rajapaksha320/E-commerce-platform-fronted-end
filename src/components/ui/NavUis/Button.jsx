import { Link } from "react-router-dom";

export const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  href,
  external = false,
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 no-underline";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 hover:border-gray-400",
    ghost:
      "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  // If href is provided, render as link
  if (href) {
    // Check if it's an external link or starts with http/https
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
          className={combinedClasses}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    } else {
      // Internal link - use React Router Link
      return (
        <Link to={href} className={combinedClasses} {...props}>
          {children}
        </Link>
      );
    }
  }

  // No href - render as button
  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
