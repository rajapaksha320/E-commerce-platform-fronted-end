/* eslint-disable no-unused-vars */
import React, { Fragment } from "react";
import {mergeClasses} from "../../../utils/classMerger";


// Loading Spinner Component
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

// Button Component
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  unstyled = false,
  href,
  external = false,
  type = "button",
  onClick,
  ...props
}) => {
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
      }
    }

    return (
      <button
        type={type}
        className={className}
        disabled={disabled || loading}
        onClick={onClick}
        {...props}
      >
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
          className={elementClasses}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          {...props}
        >
          {content}
        </a>
      );
    }
  }

  return (
    <button
      type={type}
      className={elementClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
};

// Badge Component
export const Badge = ({
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

// Card Component
export const Card = ({
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

// Card Sub-components
export const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`pb-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = "" }) => {
  return <div className={`py-4 ${className}`}>{children}</div>;
};

export const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={`pt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

// Input Component
export const Input = ({
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

// Select Component
export const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  required = false,
  size = "md",
  className = "",
  disabled = false,
  children,
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
        {children ||
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
};

// Textarea Component
export const Textarea = ({
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

// Pagination Component (requires icons to be passed as props)
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems,
  className = "",
  ChevronLeftIcon,
  ChevronRightIcon,
}) => {
  // Generate page numbers with ellipsis
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Calculate start and end items for display
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Items info */}
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {ChevronLeftIcon && <ChevronLeftIcon className="h-4 w-4" />}
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {generatePageNumbers().map((page, index) => (
            <Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )}
            </Fragment>
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          {ChevronRightIcon && <ChevronRightIcon className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

// Step Indicator Component
export const StepIndicator = ({
  currentStep,
  totalSteps,
  steps,
  CheckIcon,
}) => {
  return (
    <div className="mb-8 sm:mb-12">
      <div className="relative px-2 sm:px-4">
        {/* Background Line - full width */}
        <div className="absolute top-3 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 h-0.5 bg-gray-200"></div>

        {/* Progress Line - fills based on current step */}
        <div
          className="absolute top-3 sm:top-4 left-2 sm:left-4 h-0.5 bg-green-500 transition-all duration-500 ease-out"
          style={{
            width:
              currentStep === 1
                ? "0%"
                : currentStep === 2
                ? "calc(50% - 6px)"
                : "calc(100% - 12px)",
          }}
        ></div>

        {/* Steps Container */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;

            return (
              <div
                key={index}
                className="flex flex-col items-center max-w-[100px] sm:max-w-none"
              >
                {/* Circle - sits on the line */}
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 relative z-10 ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-300 text-gray-500"
                  }`}
                >
                  {isCompleted ? (
                    CheckIcon ? (
                      <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      "✓"
                    )
                  ) : (
                    <span className="text-xs sm:text-sm">{stepNumber}</span>
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 sm:mt-3 text-center">
                  <div
                    className={`text-xs sm:text-sm font-medium leading-tight ${
                      isActive
                        ? "text-gray-900"
                        : isCompleted
                        ? "text-gray-700"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                  {/* Hide description on very small screens, show on sm and up */}
                  <div
                    className={`hidden sm:block text-xs mt-1 ${
                      isActive
                        ? "text-gray-600"
                        : isCompleted
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Step Navigation Component
export const StepNavigation = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting,
  canProceed = true,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 pt-6 sm:pt-8 border-t border-gray-200">
      {/* Previous Button Container */}
      <div className="w-full sm:w-auto order-2 sm:order-1">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {ArrowLeftIcon && <ArrowLeftIcon className="w-4 h-4 mr-2" />}
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Back</span>
          </Button>
        )}
      </div>

      {/* Next/Submit Button Container */}
      <div className="w-full sm:w-auto order-1 sm:order-2">
        {currentStep < totalSteps ? (
          <Button
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            size="lg"
            className="w-full sm:w-auto"
          >
            <span className="hidden sm:inline">Continue</span>
            <span className="sm:hidden">Next</span>
            {ArrowRightIcon && <ArrowRightIcon className="w-4 h-4 ml-2" />}
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!canProceed || isSubmitting}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                <span className="hidden sm:inline">Processing...</span>
                <span className="sm:hidden">Processing</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Complete Registration</span>
                <span className="sm:hidden">Complete</span>
                {CheckCircleIcon && (
                  <CheckCircleIcon className="w-4 h-4 ml-2" />
                )}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

