import React, {
  forwardRef,
  createContext,
  useContext,
  useState,
  useRef,
} from "react";
import {
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  Tag,
  Trash2,
  Palette,
  Search,
  ChevronDown,
  Check,
  Copy,
  AlertCircle,
} from "lucide-react";


const TabsContext = createContext();

// Button Component
export const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      disabled = false,
      className = "",
      icon,
      iconPosition = "left",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md",
      secondary:
        "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500 shadow-sm",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
      success:
        "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md",
      warning:
        "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 shadow-sm hover:shadow-md",
      ghost:
        "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500",
      link: "text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline focus:ring-blue-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2",
      xl: "px-8 py-4 text-lg gap-3",
    };

    const iconSizes = {
      sm: "h-4 w-4",
      md: "h-4 w-4",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className={iconSizes[size]}>
            {React.cloneElement(icon, { className: iconSizes[size] })}
          </span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className={iconSizes[size]}>
            {React.cloneElement(icon, { className: iconSizes[size] })}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// IconButton Component
export const IconButton = forwardRef(
  (
    {
      children,
      variant = "ghost",
      size = "md",
      disabled = false,
      className = "",
      title,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary:
        "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      ghost:
        "text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    };

    const sizes = {
      sm: "p-1.5",
      md: "p-2",
      lg: "p-3",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        title={title}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

// Input Component
export const Input = forwardRef(
  (
    {
      type = "text",
      className = "",
      error = false,
      icon,
      iconPosition = "left",
      placeholder,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "block w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500";

    const errorClasses = error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "";

    const paddingClasses = icon
      ? iconPosition === "left"
        ? "pl-10 pr-4 py-2.5"
        : "pl-4 pr-10 py-2.5"
      : "px-4 py-2.5";

    if (icon) {
      return (
        <div className="relative">
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`${baseClasses} ${errorClasses} ${paddingClasses} ${className}`}
            {...props}
          />
          <div
            className={`absolute inset-y-0 ${
              iconPosition === "left" ? "left-0 pl-3" : "right-0 pr-3"
            } flex items-center pointer-events-none`}
          >
            {React.cloneElement(icon, { className: "h-5 w-5 text-gray-400" })}
          </div>
        </div>
      );
    }

    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`${baseClasses} ${errorClasses} ${paddingClasses} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

// SearchInput Component
export const SearchInput = forwardRef(
  ({ placeholder = "Search...", className = "", ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        placeholder={placeholder}
        icon={<Search />}
        iconPosition="left"
        className={className}
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";

// Select Component
export const Select = forwardRef(
  ({ children, className = "", error = false, placeholder, ...props }, ref) => {
    const baseClasses =
      "block w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 pr-10 pl-4 py-2.5 appearance-none";
    const errorClasses = error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "";

    return (
      <div className="relative">
        <select
          ref={ref}
          className={`${baseClasses} ${errorClasses} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

// Textarea Component
export const Textarea = forwardRef(
  (
    { className = "", error = false, rows = 3, resize = true, ...props },
    ref
  ) => {
    const baseClasses =
      "block w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 px-4 py-2.5";
    const errorClasses = error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "";
    const resizeClasses = resize ? "resize-vertical" : "resize-none";

    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`${baseClasses} ${errorClasses} ${resizeClasses} ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

// Checkbox Component
export const Checkbox = forwardRef(
  ({ className = "", label, description, error = false, ...props }, ref) => {
    const baseClasses =
      "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-colors duration-200";
    const errorClasses = error ? "border-red-300" : "";

    if (label) {
      return (
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              className={`${baseClasses} ${errorClasses} ${className}`}
              {...props}
            />
          </div>
          <div className="ml-3 text-sm">
            <label className="font-medium text-gray-700">{label}</label>
            {description && <p className="text-gray-500">{description}</p>}
          </div>
        </div>
      );
    }

    return (
      <input
        ref={ref}
        type="checkbox"
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

// Badge Component
export const Badge = ({
  children,
  variant = "default",
  size = "sm",
  className = "",
  icon,
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";

  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800 border border-blue-200",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
    orange: "bg-orange-100 text-orange-800 border border-orange-200",
    purple: "bg-purple-100 text-purple-800 border border-purple-200",
  };

  const sizes = {
    xs: "px-2 py-0.5 text-xs gap-1",
    sm: "px-2.5 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-sm gap-2",
  };

  const iconSizes = {
    xs: "h-3 w-3",
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-4 w-4",
  };

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && React.cloneElement(icon, { className: iconSizes[size] })}
      {children}
    </span>
  );
};

// Card Component
export const Card = ({
  children,
  className = "",
  padding = true,
  shadow = true,
}) => {
  const baseClasses = "bg-white rounded-lg border border-gray-200";
  const paddingClasses = padding ? "p-6" : "";
  const shadowClasses = shadow ? "shadow-sm" : "";

  return (
    <div
      className={`${baseClasses} ${paddingClasses} ${shadowClasses} ${className}`}
    >
      {children}
    </div>
  );
};

// CardHeader Component
export const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`border-b border-gray-200 pb-4 mb-6 ${className}`}>
      {children}
    </div>
  );
};

// CardTitle Component
export const CardTitle = ({ children, className = "" }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

// CardContent Component
export const CardContent = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};

// Modal Component
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
  hideCloseButton = false,
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
    full: "max-w-full h-full",
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${sizes[size]} ${
          size === "full" ? "h-full" : "max-h-[90vh]"
        } overflow-hidden flex flex-col ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {!hideCloseButton && (
              <IconButton variant="ghost" onClick={onClose}>
                <X className="h-5 w-5" />
              </IconButton>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
};

// ModalContent Component
export const ModalContent = ({ children, className = "" }) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

// ModalFooter Component
export const ModalFooter = ({ children, className = "" }) => {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 ${className}`}
    >
      {children}
    </div>
  );
};

// Avatar Component
export const Avatar = ({
  src,
  alt = "",
  size = "md",
  fallback,
  className = "",
}) => {
  const sizes = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  };

  const baseClasses =
    "inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium overflow-hidden";

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${baseClasses} ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <div className={`${baseClasses} ${sizes[size]} ${className}`}>
      {fallback || alt.charAt(0).toUpperCase()}
    </div>
  );
};

// CopyField Component
export const CopyField = ({
  label,
  value,
  icon,
  onCopy,
  copied = false,
  className = "",
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    if (onCopy) onCopy();
  };

  return (
    <div
      className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${className}`}
    >
      <div className="flex items-center gap-3">
        {icon &&
          React.cloneElement(icon, { className: "h-4 w-4 text-gray-500" })}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-sm font-medium text-gray-900">{value}</p>
        </div>
      </div>
      <IconButton
        variant="ghost"
        onClick={handleCopy}
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4 text-gray-500" />
        )}
      </IconButton>
    </div>
  );
};

// Alert Component
export const Alert = ({
  variant = "info",
  title,
  children,
  icon,
  className = "",
}) => {
  const variants = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    danger: "bg-red-50 border-red-200 text-red-800",
  };

  const defaultIcons = {
    info: <AlertCircle className="h-5 w-5" />,
    success: <Check className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    danger: <AlertCircle className="h-5 w-5" />,
  };

  return (
    <div className={`border rounded-lg p-4 ${variants[variant]} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icon || defaultIcons[variant]}</div>
        <div className="flex-1">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

// FormField Component
export const FormField = ({
  label,
  error,
  required = false,
  children,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Dropdown Component
export const Dropdown = ({
  trigger,
  children,
  isOpen,
  onToggle,
  position = "bottom-right",
  className = "",
}) => {
  const positions = {
    "bottom-left": "left-0 mt-2",
    "bottom-right": "right-0 mt-2",
    "top-left": "left-0 mb-2 bottom-full",
    "top-right": "right-0 mb-2 bottom-full",
  };

  return (
    <div className="relative">
      <div onClick={onToggle}>{trigger}</div>
      {isOpen && (
        <>
          <div
            className={`absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 min-w-48 ${positions[position]} ${className}`}
          >
            {children}
          </div>
          <div className="fixed inset-0 z-40" onClick={onToggle} />
        </>
      )}
    </div>
  );
};

// Table Components
export const Table = ({ children, className = "" }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className = "" }) => {
  return <thead className={`bg-gray-50 ${className}`}>{children}</thead>;
};

export const TableBody = ({ children, className = "" }) => {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, className = "", hover = true }) => {
  const hoverClasses = hover ? "hover:bg-gray-50" : "";
  return <tr className={`${hoverClasses} ${className}`}>{children}</tr>;
};

export const TableHead = ({
  children,
  sortable = false,
  onSort,
  sortDirection,
  className = "",
}) => {
  const baseClasses =
    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  const sortableClasses = sortable ? "cursor-pointer hover:bg-gray-100" : "";

  return (
    <th
      className={`${baseClasses} ${sortableClasses} ${className}`}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortable &&
          sortDirection &&
          (sortDirection === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          ))}
      </div>
    </th>
  );
};

export const TableCell = ({ children, className = "" }) => {
  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}
    >
      {children}
    </td>
  );
};

export const Tabs = ({
  value,
  onValueChange,
  defaultValue,
  children,
  className = "",
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const currentValue = value !== undefined ? value : internalValue;
  const handleValueChange =
    value !== undefined ? onValueChange : setInternalValue;

  return (
    <TabsContext.Provider
      value={{ value: currentValue, onValueChange: handleValueChange }}
    >
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

// TabsList Component
export const TabsList = ({ children, className = "" }) => {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}
    >
      {children}
    </div>
  );
};

// TabsTrigger Component
export const TabsTrigger = ({
  value,
  children,
  disabled = false,
  className = "",
}) => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }

  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  const handleClick = () => {
    if (!disabled && onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 
        disabled:pointer-events-none disabled:opacity-50
        ${
          isSelected
            ? "bg-white text-gray-950 shadow-sm"
            : "hover:bg-gray-200 hover:text-gray-900"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// TabsContent Component
export const TabsContent = ({ value, children, className = "" }) => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }

  const { value: selectedValue } = context;

  if (selectedValue !== value) {
    return null;
  }

  return (
    <div
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  );
};


export const ColorPicker = ({
  colors = [],
  onColorsChange,
  className = "",
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [colorName, setColorName] = useState("");

  // Check if react-color is available
  const ReactColor = window.ReactColor;
  const SketchPicker = ReactColor?.SketchPicker;

  const addColor = () => {
    if (colorName && currentColor) {
      const newColor = {
        id: Date.now().toString(),
        name: colorName,
        hex: currentColor,
      };
      onColorsChange([...colors, newColor]);
      setColorName("");
      setCurrentColor("#000000");
      setShowPicker(false);
    }
  };

  const removeColor = (colorId) => {
    onColorsChange(colors.filter((color) => color.id !== colorId));
  };

  const handleColorChange = (color) => {
    setCurrentColor(color.hex);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selected Colors */}
      {colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Colors ({colors.length})
          </label>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <div
                key={color.id}
                className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2 border hover:bg-gray-100 transition-colors"
              >
                <div
                  className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm text-gray-700 font-medium">
                  {color.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeColor(color.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Color Section */}
      {showPicker ? (
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">Add New Color</h4>
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <FormField label="Color Name" required>
            <Input
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="e.g., Midnight Blue, Cherry Red"
            />
          </FormField>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pick Color
            </label>
            {SketchPicker ? (
              <SketchPicker
                color={currentColor}
                onChange={handleColorChange}
                disableAlpha={true}
                presetColors={[
                  "#FF0000",
                  "#FF8000",
                  "#FFFF00",
                  "#80FF00",
                  "#00FF00",
                  "#00FF80",
                  "#00FFFF",
                  "#0080FF",
                  "#0000FF",
                  "#8000FF",
                  "#FF00FF",
                  "#FF0080",
                  "#000000",
                  "#404040",
                  "#808080",
                  "#C0C0C0",
                  "#FFFFFF",
                ]}
              />
            ) : (
              <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                <Palette className="h-8 w-8 mx-auto mb-2" />
                <p>Color picker library not loaded</p>
                <p className="text-xs">Please include react-color CDN</p>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button onClick={addColor} size="sm" disabled={!colorName.trim()}>
              Add Color
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowPicker(false)}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPicker(true)}
          className="w-full border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        >
          <Palette className="h-4 w-4 mr-2" />
          Add Product Color
        </Button>
      )}
    </div>
  );
};

// ImageUpload Component
export const ImageUpload = ({
  images = [],
  onImagesChange,
  maxImages = 10,
  className = "",
}) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const validFiles = files.filter((file) => {
      return file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024; // 5MB limit
    });

    const newImages = validFiles.map((file) => ({
      id: Date.now().toString() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    const totalImages = [...images, ...newImages].slice(0, maxImages);
    onImagesChange(totalImages);
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter((img) => img.id !== imageId);
    onImagesChange(updatedImages);
  };

  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    onImagesChange(updatedImages);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload Product Images
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Drag and drop images here, or click to browse
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose Files
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Maximum {maxImages} images, up to 5MB each. JPG, PNG, WebP supported.
        </p>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Product Images ({images.length}/{maxImages})
            </label>
            {images.length > 0 && (
              <span className="text-xs text-gray-500">
                First image will be the main product image
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50 aspect-square"
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />

                {/* Main Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                      Main
                    </span>
                  </div>
                )}

                {/* Image Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => moveImage(index, index - 1)}
                      className="bg-white text-gray-900"
                    >
                      ←
                    </Button>
                  )}

                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeImage(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {index < images.length - 1 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => moveImage(index, index + 1)}
                      className="bg-white text-gray-900"
                    >
                      →
                    </Button>
                  )}
                </div>

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs truncate">{image.name}</p>
                  <p className="text-xs text-gray-300">
                    {(image.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// TagInput Component
export const TagInput = ({
  tags = [],
  onTagsChange,
  placeholder = "Add tags...",
  maxTags = 20,
  className = "",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions] = useState([
    "Electronics",
    "Wireless",
    "Bluetooth",
    "Audio",
    "Music",
    "Gaming",
    "Professional",
    "Portable",
    "Premium",
    "High-Quality",
    "Durable",
    "Waterproof",
    "Fast-Charging",
    "Long-Battery",
    "Noise-Cancelling",
  ]);

  const addTag = (tagText) => {
    const trimmedTag = tagText.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onTagsChange([...tags, trimmedTag]);
    }
    setInputValue("");
  };

  const removeTag = (tagToRemove) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    addTag(suggestion);
  };

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      !tags.includes(suggestion) &&
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={`space-y-3 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Tags ({tags.length}/{maxTags})
        </label>

        {/* Tags Display */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-lg border">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-md"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Tag Input */}
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={tags.length >= maxTags}
        />

        <p className="text-xs text-gray-500 mt-1">
          Press Enter or comma to add tag. Maximum {maxTags} tags allowed.
        </p>
      </div>

      {/* Suggestions */}
      {inputValue && filteredSuggestions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suggested Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.slice(0, 10).map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-sm bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-50 hover:border-blue-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Success Modal Component
export const SuccessModal = ({
  isOpen,
  onClose,
  title = "Success!",
  message = "Operation completed successfully.",
  actionLabel = "Continue",
  onAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex space-x-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Close
            </Button>
            {onAction && (
              <Button onClick={onAction} className="flex-1">
                {actionLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Component to showcase all components
const UIComponentsDemo = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [selectValue, setSelectValue] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            UI Components Library
          </h1>
          <p className="text-gray-600">
            Reusable components extracted from the seller dashboard
          </p>
        </div>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button icon={<Search />}>With Icon</Button>
              <Button icon={<Search />} iconPosition="right">
                Icon Right
              </Button>
              <IconButton>
                <Search />
              </IconButton>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Text Input" required>
              <Input
                placeholder="Enter text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </FormField>

            <FormField label="Search Input">
              <SearchInput placeholder="Search..." />
            </FormField>

            <FormField label="Select Dropdown">
              <Select
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
                placeholder="Choose option..."
              >
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </FormField>

            <FormField label="Textarea">
              <Textarea placeholder="Enter description..." />
            </FormField>

            <FormField label="Checkbox">
              <Checkbox label="I agree to the terms" />
            </FormField>
          </CardContent>
        </Card>

        {/* Badges and Avatars */}
        <Card>
          <CardHeader>
            <CardTitle>Badges & Avatars</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="orange">Orange</Badge>
              <Badge variant="purple">Purple</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Avatar size="xs" fallback="XS" />
              <Avatar size="sm" fallback="SM" />
              <Avatar size="md" fallback="MD" />
              <Avatar size="lg" fallback="LG" />
              <Avatar size="xl" fallback="XL" />
            </div>
          </CardContent>
        </Card>

        {/* Interactive Components */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

              <Dropdown
                trigger={
                  <Button
                    variant="secondary"
                    icon={<ChevronDown />}
                    iconPosition="right"
                  >
                    Dropdown
                  </Button>
                }
                isOpen={dropdownOpen}
                onToggle={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
                    Option 1
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
                    Option 2
                  </button>
                </div>
              </Dropdown>
            </div>

            <CopyField
              label="Order ID"
              value="ORD-001234"
              onCopy={handleCopy}
              copied={copied}
            />

            <Alert variant="info" title="Information">
              This is an informational alert message.
            </Alert>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Table Components</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead sortable>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <IconButton size="sm">
                        <Search className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Example Modal"
          size="md"
        >
          <ModalContent>
            <p className="text-gray-600 mb-4">
              This is an example modal using the reusable Modal component.
            </p>
            <FormField label="Example Field">
              <Input placeholder="Enter something..." />
            </FormField>
          </ModalContent>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Save</Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default UIComponentsDemo;
