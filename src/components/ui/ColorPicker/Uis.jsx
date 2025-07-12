/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { Sketch, Chrome, Compact, Circle } from "@uiw/react-color";
import { ChevronDown, Palette, X, Plus } from "lucide-react";

// Simple Color Picker Component
const ColorPicker = ({
  value = "#ffffff",
  onChange,
  pickerType = "sketch",
  showPresets = true,
  disabled = false,
  label,
  className = "",
  placeholder = "Select color",
}) => {
  const [hex, setHex] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [pickerStyle, setPickerStyle] = useState(pickerType);
  const dropdownRef = useRef(null);

  // Common preset colors
  const presetColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
    "#82E0AA",
    "#F1948A",
    "#85929E",
    "#DC7633",
    "#2E86C1",
    "#28B463",
    "#D35400",
    "#8E44AD",
    "#E74C3C",
    "#3498DB",
    "#2ECC71",
    "#F39C12",
    "#9B59B6",
    "#E67E22",
    "#1ABC9C",
    "#34495E",
    "#95A5A6",
    "#000000",
    "#FFFFFF",
  ];

  useEffect(() => {
    setHex(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleColorChange = (color) => {
    const colorHex = color.hex || color;
    setHex(colorHex);
    onChange && onChange({ hex: colorHex });
  };

  const handlePresetClick = (color) => {
    const colorObj = { hex: color };
    setHex(color);
    onChange && onChange(colorObj);
  };

  const renderColorPicker = () => {
    const commonProps = {
      color: hex,
      onChange: handleColorChange,
      style: { marginTop: 8 },
    };

    switch (pickerStyle) {
      case "sketch":
        return <Sketch {...commonProps} />;
      case "chrome":
        return <Chrome {...commonProps} />;
      case "compact":
        return <Compact {...commonProps} />;
      case "circle":
        return <Circle {...commonProps} />;
      default:
        return <Sketch {...commonProps} />;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Color Input Trigger */}
      <div
        className={`
          relative w-full border border-gray-300 rounded-lg px-3 py-2 cursor-pointer
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white hover:border-gray-400"
          }
          ${isOpen ? "border-blue-500 ring-1 ring-blue-500" : ""}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-6 h-6 border border-gray-300 rounded"
              style={{ backgroundColor: hex }}
            />
            <span
              className={`text-sm ${
                hex === "#ffffff" ? "text-gray-500" : "text-gray-900"
              }`}
            >
              {hex.toUpperCase()}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Color Picker Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[300px]">
          <div className="p-4">
            {/* Picker Style Selector */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Picker Style
              </label>
              <select
                value={pickerStyle}
                onChange={(e) => setPickerStyle(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="sketch">Sketch</option>
                <option value="chrome">Chrome</option>
                <option value="compact">Compact</option>
                <option value="circle">Circle</option>
              </select>
            </div>

            {/* Color Picker */}
            {renderColorPicker()}

            {/* Preset Colors */}
            {showPresets && (
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Preset Colors
                </label>
                <div className="grid grid-cols-10 gap-1">
                  {presetColors.map((color, index) => (
                    <button
                      key={index}
                      className={`
                        w-6 h-6 rounded border-2 hover:scale-110 transition-transform
                        ${
                          hex.toLowerCase() === color.toLowerCase()
                            ? "border-blue-500"
                            : "border-gray-300"
                        }
                      `}
                      style={{ backgroundColor: color }}
                      onClick={() => handlePresetClick(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Manual Input */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Manual Input
              </label>
              <input
                type="text"
                value={hex}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#[0-9A-F]{6}$/i.test(value) || value === "#") {
                    setHex(value);
                    if (/^#[0-9A-F]{6}$/i.test(value)) {
                      onChange && onChange({ hex: value });
                    }
                  }
                }}
                className="w-full text-sm border border-gray-300 rounded px-3 py-2 font-mono"
                placeholder="#FFFFFF"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onChange && onChange({ hex });
                  setIsOpen(false);
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Multiple Color Picker for Product Variants
const MultiColorPicker = ({
  colors = [],
  onChange,
  maxColors = 10,
  label = "Product Colors",
  className = "",
}) => {
  const [selectedColors, setSelectedColors] = useState(colors);
  const [showPicker, setShowPicker] = useState(false);
  const [currentPickerColor, setCurrentPickerColor] = useState("#ff0000");

  useEffect(() => {
    setSelectedColors(colors);
  }, [colors]);

  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Handle color selection from picker
  const handleColorSelect = (colorObj) => {
    const colorHex = colorObj.hex || colorObj;

    // Validate hex color
    if (!/^#[0-9A-F]{6}$/i.test(colorHex)) {
      console.warn("Invalid color format:", colorHex);
      return;
    }

    // Check if color already exists
    const colorExists = selectedColors.some(
      (color) => color.hex.toLowerCase() === colorHex.toLowerCase()
    );

    if (colorExists) {
      alert("This color has already been added!");
      return;
    }

    const newColor = {
      id: generateId(),
      name: `Color ${selectedColors.length + 1}`,
      hex: colorHex,
    };

    const updatedColors = [...selectedColors, newColor];
    setSelectedColors(updatedColors);
    onChange && onChange(updatedColors);
    setShowPicker(false);
    setCurrentPickerColor("#ff0000"); // Reset to default
  };

  // Handle color picker change (while selecting)
  const handlePickerColorChange = (colorObj) => {
    const colorHex = colorObj.hex || colorObj;
    setCurrentPickerColor(colorHex);
  };

  const removeColor = (colorId) => {
    const updatedColors = selectedColors.filter(
      (color) => color.id !== colorId
    );
    setSelectedColors(updatedColors);
    onChange && onChange(updatedColors);
  };

  const updateColorName = (colorId, newName) => {
    const updatedColors = selectedColors.map((color) =>
      color.id === colorId ? { ...color, name: newName } : color
    );
    setSelectedColors(updatedColors);
    onChange && onChange(updatedColors);
  };

  const updateColorHex = (colorId, newHex) => {
    // Validate hex format
    if (!/^#[0-9A-F]{6}$/i.test(newHex)) {
      return;
    }

    const updatedColors = selectedColors.map((color) =>
      color.id === colorId ? { ...color, hex: newHex } : color
    );
    setSelectedColors(updatedColors);
    onChange && onChange(updatedColors);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>

      {/* Selected Colors */}
      <div className="space-y-3 mb-4">
        {selectedColors.map((color) => (
          <div
            key={color.id}
            className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div
              className="w-8 h-8 border-2 border-gray-300 rounded shadow-sm"
              style={{ backgroundColor: color.hex }}
              title={`Color: ${color.hex}`}
            />
            <input
              type="text"
              value={color.name}
              onChange={(e) => updateColorName(color.id, e.target.value)}
              className="flex-1 text-sm border border-gray-300 rounded px-3 py-2"
              placeholder="Color name"
              maxLength={30}
            />
            <input
              type="text"
              value={color.hex}
              onChange={(e) => {
                if (/^#[0-9A-F]{0,6}$/i.test(e.target.value)) {
                  if (e.target.value.length === 7) {
                    updateColorHex(color.id, e.target.value);
                  }
                }
              }}
              className="text-xs text-gray-600 font-mono border border-gray-300 rounded px-2 py-1 w-20"
              maxLength={7}
            />
            <button
              onClick={() => removeColor(color.id)}
              className="text-red-500 hover:text-red-700 p-1"
              title="Remove color"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Color Section */}
      {selectedColors.length < maxColors && (
        <div className="relative">
          {!showPicker ? (
            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 hover:bg-gray-50 w-full justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add New Color</span>
            </button>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Select Color
                </h4>
                <button
                  onClick={() => {
                    setShowPicker(false);
                    setCurrentPickerColor("#ff0000");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Color Preview */}
              <div className="mb-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 border-2 border-gray-300 rounded shadow-sm"
                    style={{ backgroundColor: currentPickerColor }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Selected Color
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {currentPickerColor.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Color Picker */}
              <div className="mb-4">
                <Sketch
                  color={currentPickerColor}
                  onChange={handlePickerColorChange}
                  disableAlpha={true}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowPicker(false);
                    setCurrentPickerColor("#ff0000");
                  }}
                  className="flex-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleColorSelect({ hex: currentPickerColor })}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Color
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Messages */}
      <div className="mt-3 space-y-1">
        {selectedColors.length >= maxColors && (
          <p className="text-xs text-amber-600">
            Maximum {maxColors} colors allowed
          </p>
        )}
        <p className="text-xs text-gray-500">
          {selectedColors.length} of {maxColors} colors added
        </p>
      </div>
    </div>
  );
};

export { ColorPicker, MultiColorPicker };
export default MultiColorPicker;
