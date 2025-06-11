
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

   const mergeClasses = (...classes) => {
      return classes.filter(Boolean).join(" ");
    };

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
