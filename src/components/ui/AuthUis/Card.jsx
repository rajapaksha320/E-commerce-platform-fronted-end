import React from "react";

const Card = ({
  children,
  className = "",
  shadow = "lg",
  padding = "lg",
  rounded = "xl",
}) => {
  const shadows = {
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl"
  };

  const paddings = {
    md: "p-5",
    lg: "p-8"
  };

  const roundedOptions = {
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl"
  };

  return (
    <div
      className={`
        w-full bg-white/90 backdrop-blur-sm border border-blue-200/30
        ${shadows[shadow]} ${paddings[padding]} ${roundedOptions[rounded]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;