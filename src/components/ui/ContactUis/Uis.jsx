/* eslint-disable no-unused-vars */
import {mergeClasses} from "../../../utils/classMerger";


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

const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  icon = null,
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";

  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
    pink: "bg-pink-100 text-pink-800",
    indigo: "bg-indigo-100 text-indigo-800",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
};

const ContactCard = ({
  children,
  className = "",
  hover = true,
  padding = true,
  shadow = "sm",
  ...props
}) => {
  const baseClasses =
    "bg-white rounded-xl border border-gray-100 transition-all duration-200";
  const hoverClasses = hover
    ? "hover:shadow-lg hover:border-gray-200 cursor-pointer"
    : "";
  const paddingClasses = padding ? "p-6" : "";

  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  return (
    <div
      className={`${baseClasses} ${shadows[shadow]} ${hoverClasses} ${paddingClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header Component
const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`pb-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

// Card Body Component
const CardBody = ({ children, className = "" }) => {
  return <div className={`py-4 ${className}`}>{children}</div>;
};

// Card Footer Component
const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={`pt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

ContactCard.Header = CardHeader;
ContactCard.Body = CardBody;
ContactCard.Footer = CardFooter;

// Input Component following your design patterns
const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  size = "md",
  className = "",
  icon = null,
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    error: "border-red-300 focus:border-red-500 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-4 py-4 text-base",
  };

  const inputClasses = mergeClasses(
    baseClasses,
    error ? variants.error : variants.default,
    sizes[size],
    icon ? "pl-10" : "",
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Select Component following your design patterns
const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  required = false,
  size = "md",
  className = "",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white";

  const variants = {
    default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-4 py-4 text-base",
  };

  const selectClasses = mergeClasses(
    baseClasses,
    variants.default,
    sizes[size],
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={selectClasses}
        disabled={disabled}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Textarea Component following your design patterns
const Textarea = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  rows = 4,
  size = "md",
  className = "",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed resize-none";

  const variants = {
    default: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
    error: "border-red-300 focus:border-red-500 focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-4 py-4 text-base",
  };

  const textareaClasses = mergeClasses(
    baseClasses,
    error ? variants.error : variants.default,
    sizes[size],
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={textareaClasses}
        disabled={disabled}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};



export {
  Button,
  Badge,
  ContactCard,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Select,
  Textarea,
};

