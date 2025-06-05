import React from "react";

const Card = ({
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

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
