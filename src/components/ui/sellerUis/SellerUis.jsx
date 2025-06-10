/* eslint-disable no-unused-vars */
import React, { useState } from "react";

import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105",
    outline:
      "border-2 border-blue-200 text-blue-700 hover:bg-blue-50 focus:ring-blue-500 shadow-md hover:shadow-lg",
    ghost: "text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    secondary:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const Input = ({
  label,
  error,
  className = "",
  required = false,
  icon,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400 ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : ""
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

const Select = ({
  label,
  error,
  children,
  className = "",
  required = false,
  icon,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        <select
          className={`w-full ${
            icon ? "pl-10" : "pl-4"
          } pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : ""
          } ${className}`}
          {...props}
        >
          {children}
        </select>
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

const StepIndicator = ({ currentStep, totalSteps, steps }) => {
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
                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
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

const StepNavigation = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSubmit,
  isSubmitting,
  canProceed = true,
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
            <ArrowLeft className="w-4 h-4 mr-2" />
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
            <ArrowRight className="w-4 h-4 ml-2" />
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
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

// To named exports:
export { Input, Button, Card, Select, StepIndicator, StepNavigation };
