/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Eye,
  AlertCircle,
  Package,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Settings,
  ShoppingCart,
  Palette,
} from "lucide-react";

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Textarea,
  Select,
  FormField,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ImageUpload,
  TagInput,
  SuccessModal,
} from "../../components/ui/sellerUis/Uis";

import { MultiColorPicker } from "../../components/ui/ColorPicker/Uis";

const Listing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Check if we're editing (product data passed via state)
  const editingProduct = location.state?.product;
  const isEditing = Boolean(editingProduct);
  const isDuplicating = location.state?.isDuplicating;

  const [activeTab, setActiveTab] = useState("basic");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    brand: "",
    category: "",
    subCategory: "",
    description: "",

    // Pricing & Inventory
    price: "",
    originalPrice: "",
    sku: "",
    quantity: "1",
    lowStockAlert: "5",

    // Product Details
    colors: [],
    sizes: [],
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },

    // Images & Media
    images: [],

    // SEO & Marketing
    tags: [],
    metaTitle: "",
    metaDescription: "",

    // Shipping & Policies
    shippingWeight: "",
    shippingClass: "standard",
    returnPolicy: "30",
    warranty: "",

    // Status
    status: "draft",
    visibility: "public",
  });

  // Categories data
  const categories = {
    electronics: {
      name: "Electronics",
      subcategories: [
        "Audio",
        "Mobile & Accessories",
        "Computers",
        "Gaming",
        "Smart Home",
        "Cameras",
        "Laptops",
        "Smartphones",
        "Tablets",
      ],
    },
    fashion: {
      name: "Fashion",
      subcategories: [
        "Men's Clothing",
        "Women's Clothing",
        "Shoes",
        "Accessories",
        "Jewelry",
        "Watches",
      ],
    },
    home: {
      name: "Home & Garden",
      subcategories: [
        "Furniture",
        "Decor",
        "Kitchen",
        "Garden",
        "Tools",
        "Storage",
      ],
    },
    sports: {
      name: "Sports & Outdoors",
      subcategories: [
        "Fitness",
        "Outdoor Recreation",
        "Team Sports",
        "Water Sports",
        "Winter Sports",
      ],
    },
    automotive: {
      name: "Automotive",
      subcategories: [
        "Car Parts",
        "Tools & Equipment",
        "Car Care",
        "Motorcycle",
        "Accessories",
      ],
    },
  };

  // Load data if editing or duplicating
  useEffect(() => {
    if ((isEditing || isDuplicating) && editingProduct) {
      setFormData({
        title: isDuplicating
          ? `${editingProduct.title} (Copy)`
          : editingProduct.title || "",
        brand: editingProduct.brand || "",
        category: editingProduct.category?.toLowerCase() || "",
        subCategory: editingProduct.subcategory || "",
        description: editingProduct.description || "",
        price: editingProduct.price?.toString() || "",
        originalPrice: editingProduct.originalPrice?.toString() || "",
        sku: isDuplicating
          ? `${editingProduct.sku}-COPY`
          : editingProduct.sku || "",
        quantity: editingProduct.quantity?.toString() || "1",
        lowStockAlert: editingProduct.lowStockAlert?.toString() || "5",
        colors: editingProduct.colors || [],
        sizes: editingProduct.sizes || [],
        weight: editingProduct.weight || "",
        dimensions: {
          length: editingProduct.dimensions?.length || "",
          width: editingProduct.dimensions?.width || "",
          height: editingProduct.dimensions?.height || "",
        },
        images: editingProduct.images || [],
        tags: editingProduct.tags || [],
        metaTitle: editingProduct.metaTitle || "",
        metaDescription: editingProduct.metaDescription || "",
        shippingWeight: editingProduct.shippingWeight || "",
        shippingClass: editingProduct.shippingClass || "standard",
        returnPolicy: editingProduct.returnPolicy || "30",
        warranty: editingProduct.warranty || "",
        status: isDuplicating ? "draft" : editingProduct.status || "draft",
        visibility: editingProduct.visibility || "public",
      });
    }
  }, [isEditing, isDuplicating, editingProduct]);

  // Auto-generate meta title when title changes
  useEffect(() => {
    if (formData.title && !formData.metaTitle) {
      setFormData((prev) => ({
        ...prev,
        metaTitle: formData.title,
      }));
    }
  }, [formData.title]);

  // Auto-generate SKU if empty and not editing
  useEffect(() => {
    if (!isEditing && !formData.sku && formData.title && formData.brand) {
      const generatedSku = `${formData.brand
        .slice(0, 3)
        .toUpperCase()}-${formData.title
        .slice(0, 10)
        .replace(/\s+/g, "")
        .toUpperCase()}-${Date.now().toString().slice(-4)}`;
      setFormData((prev) => ({
        ...prev,
        sku: generatedSku,
      }));
    }
  }, [formData.title, formData.brand, isEditing]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleDimensionChange = (dimension, value) => {
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value,
      },
    }));
  };

  const handleColorsChange = (colors) => {
    console.log("Colors updated:", colors); // Debug log
    handleInputChange("colors", colors);
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.images.length === 0)
      newErrors.images = "At least one product image is required";

    // Validation rules
    if (
      formData.price &&
      (isNaN(formData.price) || parseFloat(formData.price) <= 0)
    ) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (
      formData.originalPrice &&
      formData.price &&
      parseFloat(formData.originalPrice) <= parseFloat(formData.price)
    ) {
      newErrors.originalPrice =
        "Original price should be higher than sale price";
    }

    if (
      formData.quantity &&
      (isNaN(formData.quantity) || parseInt(formData.quantity) < 0)
    ) {
      newErrors.quantity = "Quantity must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (saveType = "draft") => {
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const errorElement = document.querySelector(
        `[data-field="${firstError}"]`
      );
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const listingData = {
        ...formData,
        status: saveType === "publish" ? "active" : "draft",
        updatedAt: new Date().toISOString(),
      };

      if (isEditing && !isDuplicating) {
        listingData.id = editingProduct.id;
        console.log("Updating listing:", listingData);
      } else {
        listingData.id = Date.now().toString();
        listingData.createdAt = new Date().toISOString();
        console.log("Creating new listing:", listingData);
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error saving listing:", error);
      alert("Failed to save listing. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuccessAction = () => {
    setShowSuccessModal(false);
    navigate("/seller/listings");
  };

  const handlePreview = () => {
    // Generate preview URL (in real app, this would create a preview token)
    const previewId = editingProduct?.id || "preview";
    navigate(`/product/${previewId}?preview=true`);
  };

  const tabs = [
    { id: "basic", name: "Basic Info", icon: FileText },
    { id: "pricing", name: "Pricing", icon: DollarSign },
    { id: "details", name: "Details", icon: Package },
    { id: "media", name: "Images", icon: ImageIcon },
    { id: "seo", name: "SEO & Tags", icon: Settings },
    { id: "shipping", name: "Shipping", icon: ShoppingCart },
  ];

  const getPageTitle = () => {
    if (isDuplicating) return "Duplicate Listing";
    if (isEditing) return "Edit Listing";
    return "Create New Listing";
  };

  const getPageSubtitle = () => {
    if (isDuplicating) return `Duplicating: ${editingProduct?.title}`;
    if (isEditing) return `Editing: ${editingProduct?.title}`;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/seller-dashboard")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Listings</span>
              </Button>

              <div className="h-6 w-px bg-gray-300" />

              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {getPageTitle()}
                </h1>
                {getPageSubtitle() && (
                  <p className="text-sm text-gray-600">{getPageSubtitle()}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                onClick={handlePreview}
                disabled={!formData.title}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              <Button
                variant="secondary"
                onClick={() => handleSave("draft")}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>

              <Button onClick={() => handleSave("publish")} disabled={isSaving}>
                {isEditing && !isDuplicating
                  ? "Update Listing"
                  : "Publish Listing"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Form */}
          <div className="col-span-12 lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6 mb-8">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center space-x-2"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Basic Information */}
              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      label="Product Title"
                      required
                      error={errors.title}
                    >
                      <Input
                        data-field="title"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        placeholder="Enter product title"
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.title.length}/200 characters
                      </p>
                    </FormField>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Brand">
                        <Input
                          value={formData.brand}
                          onChange={(e) =>
                            handleInputChange("brand", e.target.value)
                          }
                          placeholder="Enter brand name"
                        />
                      </FormField>

                      <FormField label="SKU" required error={errors.sku}>
                        <Input
                          data-field="sku"
                          value={formData.sku}
                          onChange={(e) =>
                            handleInputChange("sku", e.target.value)
                          }
                          placeholder="Enter SKU"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Auto-generated if left empty
                        </p>
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Category"
                        required
                        error={errors.category}
                      >
                        <Select
                          data-field="category"
                          value={formData.category}
                          onChange={(e) => {
                            handleInputChange("category", e.target.value);
                            handleInputChange("subCategory", ""); // Reset subcategory
                          }}
                        >
                          <option value="">Select Category</option>
                          {Object.entries(categories).map(([key, category]) => (
                            <option key={key} value={key}>
                              {category.name}
                            </option>
                          ))}
                        </Select>
                      </FormField>

                      <FormField label="Sub Category">
                        <Select
                          value={formData.subCategory}
                          onChange={(e) =>
                            handleInputChange("subCategory", e.target.value)
                          }
                          disabled={!formData.category}
                        >
                          <option value="">Select Sub Category</option>
                          {formData.category &&
                            categories[formData.category]?.subcategories.map(
                              (sub) => (
                                <option key={sub} value={sub}>
                                  {sub}
                                </option>
                              )
                            )}
                        </Select>
                      </FormField>
                    </div>

                    <FormField
                      label="Product Description"
                      required
                      error={errors.description}
                    >
                      <Textarea
                        data-field="description"
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Describe your product in detail..."
                        rows={6}
                        maxLength={2000}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.description.length}/2000 characters
                      </p>
                    </FormField>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Pricing & Inventory */}
              <TabsContent value="pricing">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Inventory</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Sale Price"
                        required
                        error={errors.price}
                      >
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            data-field="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) =>
                              handleInputChange("price", e.target.value)
                            }
                            placeholder="0.00"
                            className="pl-8"
                          />
                        </div>
                      </FormField>

                      <FormField
                        label="Original Price"
                        error={errors.originalPrice}
                      >
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <Input
                            type="number"
                            step="0.01"
                            value={formData.originalPrice}
                            onChange={(e) =>
                              handleInputChange("originalPrice", e.target.value)
                            }
                            placeholder="0.00"
                            className="pl-8"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Leave empty if no discount
                        </p>
                      </FormField>
                    </div>

                    {formData.price && formData.originalPrice && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                          <Badge variant="success">
                            {Math.round(
                              ((formData.originalPrice - formData.price) /
                                formData.originalPrice) *
                                100
                            )}
                            % OFF
                          </Badge>
                          <span className="text-sm text-green-700">
                            Customers save $
                            {(formData.originalPrice - formData.price).toFixed(
                              2
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Quantity" error={errors.quantity}>
                        <Input
                          type="number"
                          min="0"
                          value={formData.quantity}
                          onChange={(e) =>
                            handleInputChange("quantity", e.target.value)
                          }
                          placeholder="Available quantity"
                        />
                      </FormField>

                      <FormField label="Low Stock Alert">
                        <Input
                          type="number"
                          min="1"
                          value={formData.lowStockAlert}
                          onChange={(e) =>
                            handleInputChange("lowStockAlert", e.target.value)
                          }
                          placeholder="Alert when stock is low"
                        />
                      </FormField>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Product Details */}
              <TabsContent value="details">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Palette className="h-5 w-5" />
                        <span>Colors & Sizes</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Color Picker Section */}
                      <div>
                        <MultiColorPicker
                          label="Product Color Variants"
                          colors={formData.colors}
                          onChange={handleColorsChange}
                          maxColors={8}
                          className="mb-4"
                        />
                        {formData.colors.length > 0 && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                              Selected Colors Preview:
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              {formData.colors.map((color) => (
                                <div
                                  key={color.id}
                                  className="flex items-center space-x-3 p-2 bg-white rounded border"
                                >
                                  <div
                                    className="w-8 h-8 border border-gray-300 rounded shadow-sm"
                                    style={{ backgroundColor: color.hex }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {color.name}
                                    </p>
                                    <p className="text-xs text-gray-500 font-mono">
                                      {color.hex.toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Size Tags */}
                      <div>
                        <FormField label="Available Sizes">
                          <TagInput
                            tags={formData.sizes}
                            onTagsChange={(sizes) =>
                              handleInputChange("sizes", sizes)
                            }
                            placeholder="Add size (e.g., S, M, L, XL)..."
                            maxTags={10}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Press Enter or comma to add a size
                          </p>
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Physical Properties</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField label="Weight">
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            step="0.1"
                            value={formData.weight}
                            onChange={(e) =>
                              handleInputChange("weight", e.target.value)
                            }
                            placeholder="0.0"
                            className="flex-1"
                          />
                          <Select className="w-20">
                            <option value="lbs">lbs</option>
                            <option value="kg">kg</option>
                          </Select>
                        </div>
                      </FormField>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Dimensions (inches)
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          <FormField label="Length">
                            <Input
                              type="number"
                              step="0.1"
                              value={formData.dimensions.length}
                              onChange={(e) =>
                                handleDimensionChange("length", e.target.value)
                              }
                              placeholder="0.0"
                            />
                          </FormField>
                          <FormField label="Width">
                            <Input
                              type="number"
                              step="0.1"
                              value={formData.dimensions.width}
                              onChange={(e) =>
                                handleDimensionChange("width", e.target.value)
                              }
                              placeholder="0.0"
                            />
                          </FormField>
                          <FormField label="Height">
                            <Input
                              type="number"
                              step="0.1"
                              value={formData.dimensions.height}
                              onChange={(e) =>
                                handleDimensionChange("height", e.target.value)
                              }
                              placeholder="0.0"
                            />
                          </FormField>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Images & Media */}
              <TabsContent value="media">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField error={errors.images}>
                      <ImageUpload
                        data-field="images"
                        images={formData.images}
                        onImagesChange={(images) =>
                          handleInputChange("images", images)
                        }
                        maxImages={10}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Upload up to 10 high-quality images. First image will be
                        the main product image.
                      </p>
                    </FormField>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO & Marketing */}
              <TabsContent value="seo">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField label="Meta Title">
                        <Input
                          value={formData.metaTitle}
                          onChange={(e) =>
                            handleInputChange("metaTitle", e.target.value)
                          }
                          placeholder="SEO title for search engines"
                          maxLength={60}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.metaTitle.length}/60 characters -
                          Auto-generated from product title
                        </p>
                      </FormField>

                      <FormField label="Meta Description">
                        <Textarea
                          value={formData.metaDescription}
                          onChange={(e) =>
                            handleInputChange("metaDescription", e.target.value)
                          }
                          placeholder="Brief description for search engines"
                          rows={3}
                          maxLength={160}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.metaDescription.length}/160 characters
                        </p>
                      </FormField>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Product Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TagInput
                        tags={formData.tags}
                        onTagsChange={(tags) => handleInputChange("tags", tags)}
                        placeholder="Add product tags..."
                        maxTags={20}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Add relevant tags to help customers find your product
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Shipping & Policies */}
              <TabsContent value="shipping">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping & Policies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Shipping Weight">
                        <Input
                          type="number"
                          step="0.1"
                          value={formData.shippingWeight}
                          onChange={(e) =>
                            handleInputChange("shippingWeight", e.target.value)
                          }
                          placeholder="Packaged weight"
                        />
                      </FormField>

                      <FormField label="Shipping Class">
                        <Select
                          value={formData.shippingClass}
                          onChange={(e) =>
                            handleInputChange("shippingClass", e.target.value)
                          }
                        >
                          <option value="standard">Standard Shipping</option>
                          <option value="express">Express Shipping</option>
                          <option value="overnight">Overnight Shipping</option>
                          <option value="free">Free Shipping</option>
                        </Select>
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Return Policy">
                        <Select
                          value={formData.returnPolicy}
                          onChange={(e) =>
                            handleInputChange("returnPolicy", e.target.value)
                          }
                        >
                          <option value="15">15 Days</option>
                          <option value="30">30 Days</option>
                          <option value="60">60 Days</option>
                          <option value="90">90 Days</option>
                          <option value="no-return">No Returns</option>
                        </Select>
                      </FormField>

                      <FormField label="Warranty">
                        <Input
                          value={formData.warranty}
                          onChange={(e) =>
                            handleInputChange("warranty", e.target.value)
                          }
                          placeholder="e.g., 1 Year Manufacturer Warranty"
                        />
                      </FormField>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <div className="space-y-6 sticky top-24">
              {/* Preview Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Preview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.images.length > 0 ? (
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={formData.images[0].url}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    <div>
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {formData.title || "Product Title"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {formData.brand || "Brand Name"}
                      </p>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        ${formData.price || "0.00"}
                      </span>
                      {formData.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${formData.originalPrice}
                        </span>
                      )}
                    </div>

                    {formData.colors.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Colors:</p>
                        <div className="flex space-x-2 flex-wrap">
                          {formData.colors.slice(0, 5).map((color) => (
                            <div
                              key={color.id}
                              className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                              style={{ backgroundColor: color.hex }}
                              title={`${color.name} (${color.hex})`}
                            />
                          ))}
                          {formData.colors.length > 5 && (
                            <span className="text-xs text-gray-500 self-center">
                              +{formData.colors.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {formData.sizes.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Sizes:</p>
                        <div className="flex flex-wrap gap-1">
                          {formData.sizes.slice(0, 6).map((size, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {size}
                            </span>
                          ))}
                          {formData.sizes.length > 6 && (
                            <span className="text-xs text-gray-500 self-center">
                              +{formData.sizes.length - 6}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Publishing Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField label="Status">
                    <Select
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                    </Select>
                  </FormField>

                  <FormField label="Visibility">
                    <Select
                      value={formData.visibility}
                      onChange={(e) =>
                        handleInputChange("visibility", e.target.value)
                      }
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="hidden">Hidden</option>
                    </Select>
                  </FormField>

                  <div className="pt-4 border-t">
                    <div className="flex space-x-3">
                      <Button
                        variant="secondary"
                        onClick={() => handleSave("draft")}
                        disabled={isSaving}
                        className="flex-1"
                      >
                        Save Draft
                      </Button>
                      <Button
                        onClick={() => handleSave("publish")}
                        disabled={isSaving}
                        className="flex-1"
                      >
                        {isEditing && !isDuplicating ? "Update" : "Publish"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Validation Errors */}
              {Object.keys(errors).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="h-5 w-5" />
                      <span>Validation Errors</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field} className="text-sm text-red-600">
                          • {error}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={
          isDuplicating
            ? "Listing Duplicated!"
            : isEditing
            ? "Listing Updated!"
            : "Listing Created!"
        }
        message={
          isDuplicating
            ? "Your product listing has been successfully duplicated."
            : isEditing
            ? "Your product listing has been successfully updated."
            : "Your new product listing has been created successfully."
        }
        actionLabel="View Listings"
        onAction={handleSuccessAction}
      />
    </div>
  );
};

export default Listing;
