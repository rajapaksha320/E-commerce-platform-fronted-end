import React, { forwardRef } from "react";
import { Search, X, ChevronDown, Check, Copy, AlertCircle } from "lucide-react";

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
