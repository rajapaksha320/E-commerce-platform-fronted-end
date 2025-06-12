import React from "react";

const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const variants = {
    default: "bg-white border-b border-gray-200",
    pills: "bg-gray-100 rounded-lg p-1",
    underline: "border-b border-gray-200",
  };

  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const getTabClasses = (tab, isActive) => {
    const baseClasses = `flex items-center px-4 py-3 font-medium transition-all duration-200 cursor-pointer`;

    if (variant === "pills") {
      return `${baseClasses} rounded-md ${
        isActive
          ? "bg-white text-blue-600 shadow-sm"
          : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
      }`;
    }

    if (variant === "underline") {
      return `${baseClasses} border-b-2 ${
        isActive
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
      }`;
    }

    // default variant
    return `${baseClasses} border-b-2 ${
      isActive
        ? "border-blue-600 text-blue-600 bg-blue-50"
        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    }`;
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      <div className="flex space-x-0">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`${getTabClasses(tab, isActive)} ${sizes[size]}`}
            >
              {IconComponent && <IconComponent className="h-5 w-5 mr-2" />}
              <span>{tab.name}</span>
              {tab.count !== undefined && (
                <span
                  className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
