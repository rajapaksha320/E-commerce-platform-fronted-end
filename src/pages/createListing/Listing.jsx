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
  Info,
  ShoppingCart,
  Palette,
  Plus,
  Trash2,
  Copy,
  Grid3X3,
  Edit3,
  ChevronDown,
  ChevronUp,
  Upload,
  Loader2,
} from "lucide-react";

// Import Redux hooks
import {
  useListings,
  useImageUpload,
  useListingDetails,
} from "../../hooks/useSellerListingData";

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
  LoadingSpinner,
  Alert,
} from "../../components/ui/sellerUis/Uis";

import { MultiColorPicker } from "../../components/ui/ColorPicker/Uis";

const Listing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Redux hooks
  const {
    createNewListing,
    updateExistingListing,
    isLoading: listingsLoading,
    error: listingsError,
    success: listingsSuccess,
    message: listingsMessage,
    clearMessages: clearListingsMessages,
  } = useListings();

  const {
    uploadSingleImage,
    uploadImages,
    isUploading,
    pendingUploads,
    error: uploadError,
  } = useImageUpload();

  // Check if we're editing (product data passed via state)
  const editingProduct = location.state?.product;
  const isEditing = Boolean(editingProduct);
  const isDuplicating = location.state?.isDuplicating;

  const [activeTab, setActiveTab] = useState("basic");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasVariations, setHasVariations] = useState(false);
  const [expandedVariations, setExpandedVariations] = useState(new Set());
  const [savedListingData, setSavedListingData] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(new Set());

  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    brand: "",
    category: "",
    subCategory: "",
    description: "",

    // Pricing & Inventory (for non-variation products)
    price: "",
    originalPrice: "",
    sku: "",
    quantity: "1",
    lowStockAlert: "5",

    // Product Details (for non-variation products)
    colors: [],
    sizes: [],
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },

    // Images & Media (for non-variation products)
    images: [],

    // Variations
    variations: [],

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

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      clearListingsMessages();
    };
  }, [clearListingsMessages]);

  // Handle success/error messages
  useEffect(() => {
    if (listingsSuccess && !isSaving) {
      setShowSuccessModal(true);
    }
  }, [listingsSuccess, isSaving]);

  // remove error and success messages after showing within a few seconds
  useEffect(() => {
    if (listingsMessage || uploadError) {
      const timer = setTimeout(() => {
        clearListingsMessages();
        if (uploadError) {
          setShowSuccessModal(false);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [listingsMessage, uploadError, clearListingsMessages]);

  // Create new variation template
  const createNewVariation = () => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: "",
    sku: "",
    price: "",
    originalPrice: "",
    quantity: "0",
    color: null,
    sizes: [],
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    images: [],
    isDefault: false,
  });

  // Helper function to extract image URL from different formats
  const extractImageUrl = (image) => {
    if (typeof image === "string") return image;
    if (image?.url) return image.url;
    return null;
  };

  // Helper function to convert backend color format to frontend format
  const convertBackendColorToFrontend = (backendColors) => {
    if (!backendColors || !Array.isArray(backendColors)) return [];

    return backendColors.map((colorHex, index) => ({
      id: `color_${index}`,
      hex: colorHex,
      name: colorHex, // You might want to add a color name mapping here
    }));
  };

  // **NEW**: Function to automatically set default images based on variations
  const updateDefaultImagesFromVariations = (variations) => {
    if (!hasVariations || !variations || variations.length === 0) {
      return formData.images;
    }

    // Find the default variation or use the first one
    const defaultVariation =
      variations.find((v) => v.isDefault) || variations[0];

    if (
      defaultVariation &&
      defaultVariation.images &&
      defaultVariation.images.length > 0
    ) {
      // Use the first image from the default variation as the main product image
      const defaultImage = defaultVariation.images[0];

      // Create an image object in the correct format
      const imageForMainProduct = {
        id: `img_main_${Date.now()}`,
        url: extractImageUrl(defaultImage) || defaultImage.url || defaultImage,
        alt: `${formData.title || "Product"} - Main Image`,
        isPrimary: true,
        sortOrder: 1,
        uploadedAt: new Date().toISOString(),
      };

      // Return array with the default image as primary
      return [imageForMainProduct];
    }

    return formData.images;
  };

  // Load data if editing or duplicating
  useEffect(() => {
    if ((isEditing || isDuplicating) && editingProduct) {
      console.log("Loading edit product data:", editingProduct);

      // **FIXED: Use the backend hasVariations flag to determine UI state**
      const hasExistingVariations =
        editingProduct.hasVariations === true &&
        editingProduct.variations &&
        editingProduct.variations.length > 0;
      setHasVariations(hasExistingVariations);

      // Extract shipping class data
      const shippingClassData = editingProduct.shippingClass || {};

      const loadedFormData = {
        title: isDuplicating
          ? `${editingProduct.title} (Copy)`
          : editingProduct.title || "",
        brand: editingProduct.brand || "",
        category:
          editingProduct.category?.main?.toLowerCase() ||
          editingProduct.category?.toLowerCase() ||
          "",
        subCategory:
          editingProduct.category?.sub || editingProduct.subcategory || "",
        description: editingProduct.description || "",

        // **FIXED: For non-variation products, extract data from variation or main level**
        price: (() => {
          if (!hasExistingVariations) {
            // Try to get from single variation first, then fallback to main level
            const singleVariation = editingProduct.variations?.[0];
            return (
              singleVariation?.price?.toString() ||
              editingProduct.price?.toString() ||
              ""
            );
          }
          return "";
        })(),

        originalPrice: (() => {
          if (!hasExistingVariations) {
            // Try to get from single variation first, then fallback to main level
            const singleVariation = editingProduct.variations?.[0];
            return (
              singleVariation?.originalPrice?.toString() ||
              editingProduct.originalPrice?.toString() ||
              ""
            );
          }
          return "";
        })(),

        sku: isDuplicating
          ? `${editingProduct.sku || editingProduct.id}-COPY`
          : editingProduct.sku || editingProduct.id || "",

        quantity: (() => {
          if (!hasExistingVariations) {
            // Try to get from single variation first, then fallback to main level
            const singleVariation = editingProduct.variations?.[0];
            return (
              singleVariation?.quantity?.toString() ||
              editingProduct.quantity?.toString() ||
              "1"
            );
          }
          return "1";
        })(),

        lowStockAlert: editingProduct.lowStockAlert?.toString() || "5",

        // **FIXED: Extract colors and sizes from variation or main level for non-variation products**
        colors: (() => {
          if (!hasExistingVariations) {
            // Try to get from single variation first, then fallback to main level
            const singleVariation = editingProduct.variations?.[0];
            if (singleVariation?.color?.length > 0) {
              return convertBackendColorToFrontend(singleVariation.color);
            }
            return editingProduct.colors
              ? convertBackendColorToFrontend(editingProduct.colors)
              : [];
          }
          return [];
        })(),

        sizes: (() => {
          if (!hasExistingVariations) {
            // Try to get from single variation first, then fallback to main level
            const singleVariation = editingProduct.variations?.[0];
            return singleVariation?.sizes || editingProduct.sizes || [];
          }
          return [];
        })(),

        // **FIXED: Physical properties - check variation first for non-variation products**
        weight: (() => {
          if (!hasExistingVariations) {
            const singleVariation = editingProduct.variations?.[0];
            return singleVariation?.weight || editingProduct.weight || "";
          }
          return editingProduct.weight || "";
        })(),

        dimensions: (() => {
          if (!hasExistingVariations) {
            const singleVariation = editingProduct.variations?.[0];
            if (singleVariation?.dimensions) {
              return {
                length: singleVariation.dimensions.length || "",
                width: singleVariation.dimensions.width || "",
                height: singleVariation.dimensions.height || "",
              };
            }
          }
          return {
            length: editingProduct.dimensions?.length || "",
            width: editingProduct.dimensions?.width || "",
            height: editingProduct.dimensions?.height || "",
          };
        })(),

        // **FIXED: Images - prioritize main product images, fallback to variation images for non-variation products**
        images: (() => {
          // First try main product images
          if (editingProduct.images?.length > 0) {
            return editingProduct.images
              .map((img, index) => {
                const url = extractImageUrl(img);
                return url ? { url, name: `image_${index}.jpg` } : null;
              })
              .filter(Boolean);
          }

          // For non-variation products, also check single variation images
          if (
            !hasExistingVariations &&
            editingProduct.variations?.[0]?.images?.length > 0
          ) {
            return editingProduct.variations[0].images
              .map((img, index) => {
                const url = extractImageUrl(img);
                return url ? { url, name: `image_${index}.jpg` } : null;
              })
              .filter(Boolean);
          }

          return [];
        })(),

        // **FIXED: Only load variations if hasVariations is true**
        variations: hasExistingVariations
          ? editingProduct.variations.map((variation) => ({
              ...variation,
              id: isDuplicating
                ? Date.now().toString() +
                  Math.random().toString(36).substr(2, 9)
                : variation.id,
              sku: isDuplicating ? `${variation.sku}-COPY` : variation.sku,
              // Convert color from array format to single color object
              color:
                variation.color && variation.color.length > 0
                  ? { hex: variation.color[0], name: variation.color[0] }
                  : null,
              // Convert images
              images:
                variation.images
                  ?.map((img, index) => {
                    const url = extractImageUrl(img);
                    return url
                      ? { url, name: `variation_image_${index}.jpg` }
                      : null;
                  })
                  .filter(Boolean) || [],
            }))
          : [],

        // Tags - extract from productTags
        tags: editingProduct.productTags || editingProduct.tags || [],

        // SEO data
        metaTitle: editingProduct.metaTitle || "",
        metaDescription: editingProduct.metaDescription || "",

        // Shipping & Policies - extract from shippingClass object
        shippingWeight: shippingClassData.shippingWeight || "",
        shippingClass: shippingClassData.shippingClass || "standard",
        returnPolicy: shippingClassData.returnPolicy || "30",
        warranty: shippingClassData.warranty || "",

        // Status and visibility
        status: isDuplicating ? "draft" : editingProduct.status || "draft",
      };

      setFormData(loadedFormData);
    }
  }, [isEditing, isDuplicating, editingProduct]);

  // **NEW**: Update default images when variations change
  useEffect(() => {
    if (hasVariations && formData.variations.length > 0) {
      const updatedImages = updateDefaultImagesFromVariations(
        formData.variations
      );
      if (JSON.stringify(updatedImages) !== JSON.stringify(formData.images)) {
        setFormData((prev) => ({
          ...prev,
          images: updatedImages,
        }));
      }
    }
  }, [hasVariations, formData.variations]);

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
    console.log("Colors updated:", colors);
    handleInputChange("colors", colors);
  };

  // **ENHANCED**: Image upload handlers with better UI feedback
  const handleImagesChange = async (images) => {
    const uploadedImages = [];
    setUploadingImages(new Set(["main"]));

    try {
      for (const image of images) {
        if (image.file) {
          try {
            const uploadedUrl = await uploadSingleImage(image.file);
            uploadedImages.push({
              url: uploadedUrl,
              name: image.file.name,
              id: `img_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              alt: `${formData.title || "Product"} - Image`,
              isPrimary: uploadedImages.length === 0,
              sortOrder: uploadedImages.length + 1,
              uploadedAt: new Date().toISOString(),
            });
          } catch (error) {
            console.error("Error uploading image:", error);
            // Add original image if upload fails
            uploadedImages.push(image);
          }
        } else {
          // Existing image
          uploadedImages.push(image);
        }
      }

      handleInputChange("images", uploadedImages);
    } finally {
      setUploadingImages(new Set());
    }
  };

  const handleVariationImagesChange = async (variationId, images) => {
    const uploadedImages = [];
    setUploadingImages(new Set([variationId]));

    try {
      for (const image of images) {
        if (image.file) {
          try {
            const uploadedUrl = await uploadSingleImage(image.file);
            uploadedImages.push({
              url: uploadedUrl,
              name: image.file.name,
              id: `var_img_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              alt: `Variation Image`,
              isPrimary: uploadedImages.length === 0,
              sortOrder: uploadedImages.length + 1,
              uploadedAt: new Date().toISOString(),
            });
          } catch (error) {
            console.error("Error uploading variation image:", error);
            uploadedImages.push(image);
          }
        } else {
          uploadedImages.push(image);
        }
      }

      updateVariation(variationId, "images", uploadedImages);

      // **NEW**: Update default images if this is the default variation
      const updatedVariations = formData.variations.map((v) =>
        v.id === variationId ? { ...v, images: uploadedImages } : v
      );

      if (hasVariations) {
        const updatedDefaultImages =
          updateDefaultImagesFromVariations(updatedVariations);
        setFormData((prev) => ({
          ...prev,
          variations: updatedVariations,
          images: updatedDefaultImages,
        }));
      }
    } finally {
      setUploadingImages(new Set());
    }
  };

  // Variation management functions
  const handleVariationToggle = (enabled) => {
    setHasVariations(enabled);
    if (enabled && formData.variations.length === 0) {
      // Add first variation when enabling
      const newVariation = createNewVariation();
      newVariation.isDefault = true;
      const newVariations = [newVariation];

      setFormData((prev) => ({
        ...prev,
        variations: newVariations,
        // Update default images based on variations
        images: updateDefaultImagesFromVariations(newVariations),
      }));
      setExpandedVariations(new Set([newVariation.id]));
    } else if (!enabled) {
      // Clear variations when disabling
      setFormData((prev) => ({
        ...prev,
        variations: [],
        // Keep existing images when disabling variations
      }));
      setExpandedVariations(new Set());
    }
  };

  const addVariation = () => {
    const newVariation = createNewVariation();
    const updatedVariations = [...formData.variations, newVariation];

    setFormData((prev) => ({
      ...prev,
      variations: updatedVariations,
      // Update default images
      images: updateDefaultImagesFromVariations(updatedVariations),
    }));
    setExpandedVariations((prev) => new Set([...prev, newVariation.id]));
  };

  const removeVariation = (variationId) => {
    const updatedVariations = formData.variations.filter(
      (v) => v.id !== variationId
    );

    setFormData((prev) => ({
      ...prev,
      variations: updatedVariations,
      // Update default images
      images: updateDefaultImagesFromVariations(updatedVariations),
    }));

    setExpandedVariations((prev) => {
      const newSet = new Set(prev);
      newSet.delete(variationId);
      return newSet;
    });
  };

  const duplicateVariation = (variationId) => {
    const variation = formData.variations.find((v) => v.id === variationId);
    if (variation) {
      const duplicatedVariation = {
        ...variation,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: `${variation.name} (Copy)`,
        sku: `${variation.sku}-COPY`,
        isDefault: false,
      };

      const updatedVariations = [...formData.variations, duplicatedVariation];

      setFormData((prev) => ({
        ...prev,
        variations: updatedVariations,
        // Update default images
        images: updateDefaultImagesFromVariations(updatedVariations),
      }));
      setExpandedVariations(
        (prev) => new Set([...prev, duplicatedVariation.id])
      );
    }
  };

  const updateVariation = (variationId, field, value) => {
    const updatedVariations = formData.variations.map((variation) =>
      variation.id === variationId
        ? { ...variation, [field]: value }
        : variation
    );

    setFormData((prev) => ({
      ...prev,
      variations: updatedVariations,
      // Update default images if the change affects images or default status
      images:
        field === "images" || field === "isDefault"
          ? updateDefaultImagesFromVariations(updatedVariations)
          : prev.images,
    }));
  };

  const updateVariationDimension = (variationId, dimension, value) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.map((variation) =>
        variation.id === variationId
          ? {
              ...variation,
              dimensions: {
                ...variation.dimensions,
                [dimension]: value,
              },
            }
          : variation
      ),
    }));
  };

  const toggleVariationExpanded = (variationId) => {
    setExpandedVariations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(variationId)) {
        newSet.delete(variationId);
      } else {
        newSet.add(variationId);
      }
      return newSet;
    });
  };

  const setDefaultVariation = (variationId) => {
    const updatedVariations = formData.variations.map((variation) => ({
      ...variation,
      isDefault: variation.id === variationId,
    }));

    setFormData((prev) => ({
      ...prev,
      variations: updatedVariations,
      // Update default images when default variation changes
      images: updateDefaultImagesFromVariations(updatedVariations),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    // Validation for products without variations
    if (!hasVariations) {
      if (!formData.price) newErrors.price = "Price is required";
      if (!formData.sku.trim()) newErrors.sku = "SKU is required";
      if (formData.images.length === 0)
        newErrors.images = "At least one product image is required";

      // Price validation
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
    }

    // Validation for products with variations
    if (hasVariations) {
      if (formData.variations.length === 0) {
        newErrors.variations = "At least one variation is required";
      } else {
        // Validate each variation
        formData.variations.forEach((variation, index) => {
          const prefix = `variation_${index}`;

          if (!variation.name.trim()) {
            newErrors[`${prefix}_name`] = `Variation ${
              index + 1
            } name is required`;
          }

          if (!variation.price) {
            newErrors[`${prefix}_price`] = `Variation ${
              index + 1
            } price is required`;
          } else if (
            isNaN(variation.price) ||
            parseFloat(variation.price) <= 0
          ) {
            newErrors[`${prefix}_price`] = `Variation ${
              index + 1
            } price must be a valid positive number`;
          }

          if (!variation.quantity && variation.quantity !== "0") {
            newErrors[`${prefix}_quantity`] = `Variation ${
              index + 1
            } quantity is required`;
          } else if (
            variation.quantity &&
            (isNaN(variation.quantity) || parseInt(variation.quantity) < 0)
          ) {
            newErrors[`${prefix}_quantity`] = `Variation ${
              index + 1
            } quantity must be a valid number`;
          }

          if (
            variation.originalPrice &&
            variation.price &&
            parseFloat(variation.originalPrice) <= parseFloat(variation.price)
          ) {
            newErrors[`${prefix}_originalPrice`] = `Variation ${
              index + 1
            } original price should be higher than sale price`;
          }
        });

        // Check for duplicate SKUs only if they are provided
        const skusWithValues = formData.variations
          .filter((v) => v.sku && v.sku.trim())
          .map((v) => v.sku.trim().toLowerCase());
        const duplicateSKUs = skusWithValues.filter(
          (sku, index) => skusWithValues.indexOf(sku) !== index
        );
        if (duplicateSKUs.length > 0) {
          newErrors.variations = "Variation SKUs must be unique when provided";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // **UPDATED**: Modified formatListingData function to always include variations
  const formatListingData = (formData) => {
    const baseData = {
      id: formData.sku, // SKU value
      title: formData.title,
      brand: formData.brand,
      category: {
        main: formData.category,
        sub: formData.subCategory,
      },
      description: formData.description,
      productTags: formData.tags, // Changed from 'tags' to 'productTags'
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      weight: formData.weight,
      dimensions: formData.dimensions,
      // Fix shippingClass - it needs to be an object, not just the class string
      shippingClass: {
        id: `ship_${Date.now()}`, // Generate unique ID
        shippingWeight: formData.shippingWeight,
        shippingClass: formData.shippingClass, // This is the actual class value (standard, express, etc.)
        returnPolicy: formData.returnPolicy,
        warranty: formData.warranty,
      },
      status: formData.status,
      hasVariations: hasVariations, // **FIXED: Use actual UI state, not always true**
    };

    // **ALWAYS send variations to API - but structure depends on UI state**
    if (hasVariations && formData.variations.length > 0) {
      // User has enabled variations in UI - use their variations
      baseData.variations = formData.variations.map((variation) => ({
        ...variation,
        color: variation.color ? [variation.color.hex] : [], // Convert to array of hex strings
        price: parseFloat(variation.price),
        originalPrice: variation.originalPrice
          ? parseFloat(variation.originalPrice)
          : null,
        quantity: parseInt(variation.quantity),
      }));

      // Use default variation or first variation for main product data
      const defaultVariation =
        formData.variations.find((v) => v.isDefault) || formData.variations[0];
      if (defaultVariation) {
        baseData.price = parseFloat(defaultVariation.price);
        baseData.originalPrice = defaultVariation.originalPrice
          ? parseFloat(defaultVariation.originalPrice)
          : null;
        baseData.sku = defaultVariation.sku;
        baseData.quantity = parseInt(defaultVariation.quantity);

        // Use the properly formatted default images
        baseData.images =
          formData.images.length > 0
            ? formData.images
            : defaultVariation.images.length > 0
            ? defaultVariation.images
            : [];
      }
    } else {
      // **CRITICAL**: User has NOT enabled variations in UI - create single variation from main product data
      // This ensures API always gets variations array, but UI shows normal form
      const singleVariation = {
        id: `single_${Date.now()}`, // Generate unique ID for the single variation
        name: "Default", // Default name for the single variation
        sku: formData.sku,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : null,
        quantity: parseInt(formData.quantity),
        color:
          formData.colors.length > 0 ? formData.colors.map((c) => c.hex) : [], // Convert colors to hex array
        sizes: formData.sizes,
        weight: formData.weight,
        dimensions: formData.dimensions,
        images: formData.images,
        isDefault: true, // Mark as default variation
      };

      // API gets variations array with single variation
      baseData.variations = [singleVariation];

      // Main product data is duplicate of single variation (API consistency)
      baseData.price = parseFloat(formData.price);
      baseData.originalPrice = formData.originalPrice
        ? parseFloat(formData.originalPrice)
        : null;
      baseData.sku = formData.sku;
      baseData.quantity = parseInt(formData.quantity);
      baseData.images = formData.images;
      baseData.colors =
        formData.colors.length > 0 ? formData.colors.map((c) => c.hex) : []; // Convert to hex array
      baseData.sizes = formData.sizes;
    }

    return baseData;
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
    clearListingsMessages();

    try {
      const listingData = formatListingData({
        ...formData,
        status: saveType === "publish" ? "active" : "draft",
      });

      console.log("Formatted listing data being sent to API:", listingData); // Debug log

      let result;
      if (isEditing && !isDuplicating) {
        result = await updateExistingListing(
          editingProduct._id || editingProduct.id,
          listingData
        );
      } else {
        result = await createNewListing(listingData);
      }

      if (result.type?.endsWith("fulfilled")) {
        setSavedListingData(result.payload);

        // Show different modals based on save type
        if (saveType === "publish") {
          setShowSummaryModal(true);
        } else {
          setShowSuccessModal(true);
        }
      }
    } catch (error) {
      console.error("Error saving listing:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuccessAction = () => {
    setShowSuccessModal(false);
    navigate("/seller-dashboard");
  };

  const handleSummaryGoToListings = () => {
    setShowSummaryModal(false);
    navigate("/seller-dashboard");
  };

  const handleSummaryCreateNew = () => {
    setShowSummaryModal(false);
    // Reset form to create new listing
    window.location.reload();
  };

  const handlePreview = () => {
    // Generate preview URL (in real app, this would create a preview token)
    const previewId = editingProduct?.id || "preview";
    navigate(`/product/${previewId}?preview=true`);
  };

  const tabs = [
    { id: "basic", name: "Basic Info", icon: FileText },
    {
      id: "pricing",
      name: hasVariations ? "Variations" : "Pricing",
      icon: hasVariations ? Grid3X3 : DollarSign,
    },
    { id: "details", name: "Details", icon: Package },
    { id: "media", name: "Images", icon: ImageIcon },
    { id: "seo", name: "Tags", icon: Settings },
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

  // Get current product data for preview (either from variations or main product)
  const getPreviewData = () => {
    if (hasVariations && formData.variations.length > 0) {
      const defaultVariation =
        formData.variations.find((v) => v.isDefault) || formData.variations[0];
      return {
        ...formData,
        price: defaultVariation.price,
        originalPrice: defaultVariation.originalPrice,
        images:
          formData.images.length > 0
            ? formData.images
            : defaultVariation.images,
        sku: defaultVariation.sku,
        colors: defaultVariation.color ? [defaultVariation.color] : [],
        sizes: defaultVariation.sizes,
      };
    }
    return formData;
  };

  const previewData = getPreviewData();
  const isProcessing =
    isSaving || listingsLoading || isUploading || uploadingImages.size > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success/Error Messages */}
      {(listingsError || uploadError) && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert variant="danger" title="Error" onClose={clearListingsMessages}>
            {listingsError || uploadError}
          </Alert>
        </div>
      )}

      {/* Upload Progress Indicator */}
      {uploadingImages.size > 0 && (
        <div className="fixed top-4 left-4 z-50 max-w-md">
          <Alert variant="info" title="Uploading Images">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                Uploading {uploadingImages.size} image
                {uploadingImages.size > 1 ? "s" : ""}...
              </span>
            </div>
          </Alert>
        </div>
      )}

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
                disabled={!formData.title || isProcessing}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>

              <Button
                variant="secondary"
                onClick={() => handleSave("draft")}
                disabled={isProcessing}
              >
                <Save className="h-4 w-4 mr-2" />
                {isProcessing ? "Saving..." : "Save Draft"}
                {isProcessing && <LoadingSpinner size="sm" className="ml-2" />}
              </Button>

              <Button
                onClick={() => handleSave("publish")}
                disabled={isProcessing}
              >
                {isEditing && !isDuplicating
                  ? "Update Listing"
                  : "Publish Listing"}
                {isProcessing && <LoadingSpinner size="sm" className="ml-2" />}
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

                      {!hasVariations && (
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
                      )}
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

              {/* Pricing & Inventory OR Variations */}
              <TabsContent value="pricing">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        {hasVariations
                          ? "Product Variations"
                          : "Pricing & Inventory"}
                      </span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-normal text-gray-600">
                          Enable Variations
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hasVariations}
                            onChange={(e) =>
                              handleVariationToggle(e.target.checked)
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-11 h-6 rounded-full transition-colors ${
                              hasVariations ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                                hasVariations
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              } mt-0.5 ml-0.5`}
                            />
                          </div>
                        </label>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {!hasVariations ? (
                      // Standard pricing form
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            label="Sale Price"
                            required
                            error={errors.price}
                          >
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                LKR
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
                                className="pl-10"
                              />
                            </div>
                          </FormField>

                          <FormField
                            label="Original Price"
                            error={errors.originalPrice}
                          >
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                LKR
                              </span>
                              <Input
                                type="number"
                                step="0.01"
                                value={formData.originalPrice}
                                onChange={(e) =>
                                  handleInputChange(
                                    "originalPrice",
                                    e.target.value
                                  )
                                }
                                placeholder="0.00"
                                className="pl-10"
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
                                Customers save LKR
                                {(
                                  formData.originalPrice - formData.price
                                ).toFixed(2)}
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
                                handleInputChange(
                                  "lowStockAlert",
                                  e.target.value
                                )
                              }
                              placeholder="Alert when stock is low"
                            />
                          </FormField>
                        </div>
                      </>
                    ) : (
                      // Variations form
                      <div className="space-y-6">
                        {/* Default Image Auto-Update Notice */}
                        {formData.variations.length > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-blue-900 mb-1">
                                  Automatic Default Image
                                </h4>
                                <p className="text-sm text-blue-700">
                                  The first image from your default variation
                                  will automatically become the main product
                                  image. Change the default variation or update
                                  variation images to update the main product
                                  image.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {errors.variations && (
                          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
                            {errors.variations}
                          </div>
                        )}

                        {formData.variations.map((variation, index) => (
                          <div
                            key={variation.id}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            {/* Variation Header */}
                            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleVariationExpanded(variation.id)
                                  }
                                  className="p-1"
                                >
                                  {expandedVariations.has(variation.id) ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">
                                    Variation #{index + 1}
                                  </span>
                                  {variation.name && (
                                    <span className="text-sm text-gray-600">
                                      - {variation.name}
                                    </span>
                                  )}
                                  {variation.isDefault && (
                                    <Badge variant="primary" size="sm">
                                      Default
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    duplicateVariation(variation.id)
                                  }
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                {!variation.isDefault && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setDefaultVariation(variation.id)
                                    }
                                    className="text-blue-600 hover:text-blue-700 text-xs"
                                  >
                                    Set as Default
                                  </Button>
                                )}
                                {formData.variations.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeVariation(variation.id)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Variation Content */}
                            {expandedVariations.has(variation.id) && (
                              <div className="p-6 space-y-6">
                                {/* Basic Variation Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <FormField
                                    label="Variation Name"
                                    required
                                    error={errors[`variation_${index}_name`]}
                                  >
                                    <Input
                                      value={variation.name}
                                      onChange={(e) =>
                                        updateVariation(
                                          variation.id,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g., Red - Large, Black - Medium"
                                    />
                                  </FormField>

                                  <FormField
                                    label="SKU (Optional)"
                                    error={errors[`variation_${index}_sku`]}
                                  >
                                    <Input
                                      value={variation.sku}
                                      onChange={(e) =>
                                        updateVariation(
                                          variation.id,
                                          "sku",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Unique SKU for this variation"
                                    />
                                  </FormField>
                                </div>

                                {/* Pricing */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <FormField
                                    label="Price"
                                    required
                                    error={errors[`variation_${index}_price`]}
                                  >
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        LKR <span className="mr-2"></span>
                                      </span>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={variation.price}
                                        onChange={(e) =>
                                          updateVariation(
                                            variation.id,
                                            "price",
                                            e.target.value
                                          )
                                        }
                                        placeholder="0.00"
                                        className="pl-10"
                                      />
                                    </div>
                                  </FormField>

                                  <FormField
                                    label="Original Price"
                                    error={
                                      errors[`variation_${index}_originalPrice`]
                                    }
                                  >
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        LKR <span className="mr-2"></span>
                                      </span>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={variation.originalPrice}
                                        onChange={(e) =>
                                          updateVariation(
                                            variation.id,
                                            "originalPrice",
                                            e.target.value
                                          )
                                        }
                                        placeholder="0.00"
                                        className="pl-10"
                                      />
                                    </div>
                                  </FormField>
                                </div>

                                {/* Inventory */}
                                <div className="grid grid-cols-1 gap-6">
                                  <FormField
                                    label="Quantity"
                                    required
                                    error={
                                      errors[`variation_${index}_quantity`]
                                    }
                                  >
                                    <Input
                                      type="number"
                                      min="0"
                                      value={variation.quantity}
                                      onChange={(e) =>
                                        updateVariation(
                                          variation.id,
                                          "quantity",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Available quantity"
                                    />
                                  </FormField>
                                </div>

                                {/* Color Selection */}
                                <div>
                                  <MultiColorPicker
                                    label="Variation Color (Optional)"
                                    colors={
                                      variation.color ? [variation.color] : []
                                    }
                                    onChange={(colors) =>
                                      updateVariation(
                                        variation.id,
                                        "color",
                                        colors[0] || null
                                      )
                                    }
                                    maxColors={1}
                                    className="mb-4"
                                  />
                                </div>

                                {/* Sizes */}
                                <div>
                                  <FormField label="Available Sizes (Optional)">
                                    <TagInput
                                      tags={variation.sizes}
                                      onTagsChange={(sizes) =>
                                        updateVariation(
                                          variation.id,
                                          "sizes",
                                          sizes
                                        )
                                      }
                                      placeholder="Add size (e.g., S, M, L, XL)..."
                                      maxTags={10}
                                    />
                                  </FormField>
                                </div>

                                {/* Physical Properties */}
                                <div className="space-y-4">
                                  <h4 className="font-medium text-gray-900">
                                    Physical Properties (Optional)
                                  </h4>

                                  <FormField label="Weight (Optional)">
                                    <div className="flex space-x-2">
                                      <Input
                                        type="number"
                                        step="0.1"
                                        value={variation.weight}
                                        onChange={(e) =>
                                          updateVariation(
                                            variation.id,
                                            "weight",
                                            e.target.value
                                          )
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
                                      Dimensions (inches) - Optional
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                      <FormField label="Length">
                                        <Input
                                          type="number"
                                          step="0.1"
                                          value={variation.dimensions.length}
                                          onChange={(e) =>
                                            updateVariationDimension(
                                              variation.id,
                                              "length",
                                              e.target.value
                                            )
                                          }
                                          placeholder="0.0"
                                        />
                                      </FormField>
                                      <FormField label="Width">
                                        <Input
                                          type="number"
                                          step="0.1"
                                          value={variation.dimensions.width}
                                          onChange={(e) =>
                                            updateVariationDimension(
                                              variation.id,
                                              "width",
                                              e.target.value
                                            )
                                          }
                                          placeholder="0.0"
                                        />
                                      </FormField>
                                      <FormField label="Height">
                                        <Input
                                          type="number"
                                          step="0.1"
                                          value={variation.dimensions.height}
                                          onChange={(e) =>
                                            updateVariationDimension(
                                              variation.id,
                                              "height",
                                              e.target.value
                                            )
                                          }
                                          placeholder="0.0"
                                        />
                                      </FormField>
                                    </div>
                                  </div>
                                </div>

                                {/* Variation Images */}
                                <div>
                                  <FormField
                                    label="Variation Images (Optional)"
                                    error={errors[`variation_${index}_images`]}
                                  >
                                    <ImageUpload
                                      images={variation.images}
                                      onImagesChange={(images) =>
                                        handleVariationImagesChange(
                                          variation.id,
                                          images
                                        )
                                      }
                                      maxImages={5}
                                      disabled={uploadingImages.has(
                                        variation.id
                                      )}
                                    />
                                    {uploadingImages.has(variation.id) && (
                                      <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Uploading images...</span>
                                      </div>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">
                                      Upload up to 5 images for this variation.
                                      {variation.isDefault &&
                                        " The first image will become the main product image."}
                                    </p>
                                  </FormField>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Add Variation Button */}
                        <Button
                          variant="outline"
                          onClick={addVariation}
                          className="w-full border-dashed border-2 border-gray-300 py-6"
                          disabled={isProcessing}
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          Add New Variation
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Product Details */}
              <TabsContent value="details">
                <div className="space-y-6">
                  {!hasVariations && (
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
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {hasVariations
                          ? "Default Physical Properties"
                          : "Physical Properties"}
                      </CardTitle>
                      {hasVariations && (
                        <p className="text-sm text-gray-600">
                          These settings apply to all variations unless
                          overridden individually
                        </p>
                      )}
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
                    <CardTitle>
                      {hasVariations
                        ? "Default Product Images"
                        : "Product Images"}
                    </CardTitle>
                    {hasVariations ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-700">
                          <strong>Auto-generated from variations:</strong> These
                          images are automatically set based on your default
                          variation's images. To change these images, update the
                          default variation or switch which variation is set as
                          default.
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Upload high-quality images of your product. The first
                        image will be the main product image.
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <FormField error={!hasVariations ? errors.images : null}>
                      <ImageUpload
                        data-field="images"
                        images={formData.images}
                        onImagesChange={handleImagesChange}
                        maxImages={10}
                        disabled={uploadingImages.has("main") || hasVariations}
                        readOnly={hasVariations}
                      />
                      {uploadingImages.has("main") && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Uploading images...</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {hasVariations
                          ? "These images are managed through your product variations. Edit the default variation to change the main product image."
                          : "Upload up to 10 high-quality images. First image will be the main product image."}
                        {(uploadingImages.has("main") || isUploading) &&
                          " Please wait while images are being uploaded..."}
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
                        Add relevant tags to help customers find your product.
                        Current tags: {formData.tags.length}
                      </p>
                      {formData.tags.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 rounded border">
                          <p className="text-sm font-medium text-blue-900 mb-2">
                            Preview:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
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
                      <FormField label="Shipping Weight in lbs">
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

                    {hasVariations && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">
                          Variation Shipping
                        </h4>
                        <p className="text-sm text-blue-700">
                          When using variations, shipping calculations will use
                          each variation's individual weight and dimensions if
                          specified, otherwise falling back to the default
                          values above.
                        </p>
                      </div>
                    )}

                    {/* Preview shipping data if editing */}
                    {(isEditing || isDuplicating) &&
                      editingProduct?.shippingClass && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Current Shipping Settings:
                          </h4>
                          <div className="text-sm space-y-1">
                            <p>
                              <strong>Weight:</strong>{" "}
                              {formData.shippingWeight || "Not set"} lbs
                            </p>
                            <p>
                              <strong>Class:</strong> {formData.shippingClass}
                            </p>
                            <p>
                              <strong>Return Policy:</strong>{" "}
                              {formData.returnPolicy} days
                            </p>
                            <p>
                              <strong>Warranty:</strong>{" "}
                              {formData.warranty || "Not set"}
                            </p>
                          </div>
                        </div>
                      )}
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
                    {hasVariations && (
                      <Badge variant="secondary" size="sm">
                        {previewData ===
                          formData.variations.find((v) => v.isDefault) ||
                        formData.variations[0]
                          ? "Default Variation"
                          : "Base Product"}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {previewData.images.length > 0 ? (
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={previewData.images[0].url}
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
                        {previewData.title || "Product Title"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {previewData.brand || "Brand Name"}
                      </p>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        LKR {previewData.price || "0.00"}
                      </span>
                      {previewData.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          LKR {previewData.originalPrice}
                        </span>
                      )}
                    </div>

                    {hasVariations && (
                      <div className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded p-2">
                        {formData.variations.length} variation
                        {formData.variations.length !== 1 ? "s" : ""} available
                      </div>
                    )}

                    {previewData.colors.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Colors:</p>
                        <div className="flex space-x-2 flex-wrap">
                          {previewData.colors.slice(0, 5).map((color) => (
                            <div
                              key={color.id}
                              className="w-6 h-6 rounded border border-gray-300 shadow-sm"
                              style={{ backgroundColor: color.hex }}
                              title={`${color.name} (${color.hex})`}
                            />
                          ))}
                          {previewData.colors.length > 5 && (
                            <span className="text-xs text-gray-500 self-center">
                              +{previewData.colors.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {previewData.sizes.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Sizes:</p>
                        <div className="flex flex-wrap gap-1">
                          {previewData.sizes.slice(0, 6).map((size, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {size}
                            </span>
                          ))}
                          {previewData.sizes.length > 6 && (
                            <span className="text-xs text-gray-500 self-center">
                              +{previewData.sizes.length - 6}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {previewData.tags.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-600 mb-2">Tags:</p>
                        <div className="flex flex-wrap gap-1">
                          {previewData.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                          {previewData.tags.length > 3 && (
                            <span className="text-xs text-gray-500 self-center">
                              +{previewData.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Variations Summary */}
              {hasVariations && formData.variations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Grid3X3 className="h-5 w-5" />
                      <span>Variations Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {formData.variations.map((variation, index) => (
                        <div
                          key={variation.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {variation.name || `Variation #${index + 1}`}
                              </p>
                              {variation.isDefault && (
                                <Badge variant="primary" size="xs">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 mt-1">
                              {variation.color && (
                                <div
                                  className="w-4 h-4 rounded border border-gray-300"
                                  style={{
                                    backgroundColor: variation.color.hex,
                                  }}
                                  title={variation.color.name}
                                />
                              )}
                              <span className="text-sm font-semibold text-gray-700">
                                LKR {variation.price || "0.00"}
                              </span>
                              <span className="text-xs text-gray-500">
                                Qty: {variation.quantity || "0"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

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
                      <option value="inactive">Inactive</option>
                    </Select>
                  </FormField>

                  {/* <FormField label="Visibility">
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
                  </FormField> */}

                  <div className="pt-4 border-t">
                    <div className="flex space-x-3">
                      <Button
                        variant="secondary"
                        onClick={() => handleSave("draft")}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        Save Draft
                        {isProcessing && (
                          <LoadingSpinner size="sm" className="ml-2" />
                        )}
                      </Button>
                      <Button
                        onClick={() => handleSave("publish")}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        {isEditing && !isDuplicating ? "Update" : "Publish"}
                        {isProcessing && (
                          <LoadingSpinner size="sm" className="ml-2" />
                        )}
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
            : "Draft Saved!"
        }
        message={
          isDuplicating
            ? "Your product listing has been successfully duplicated."
            : isEditing
            ? "Your product listing has been successfully updated."
            : "Your draft has been saved successfully."
        }
        actionLabel="View Listings"
        onAction={handleSuccessAction}
      />

      {/* Listing Summary Modal */}
      {showSummaryModal && savedListingData && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isEditing && !isDuplicating
                    ? "Listing Updated Successfully!"
                    : "Listing Published Successfully!"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your product listing is now live and visible to customers.
                </p>
              </div>

              {/* Quick Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Quick Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product:</span>
                    <span className="font-medium">
                      {savedListingData.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">
                      {categories[savedListingData.category?.main]?.name ||
                        savedListingData.category}
                    </span>
                  </div>
                  {hasVariations ? (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Variations:</span>
                      <span className="font-medium">
                        {savedListingData.variations?.length || 0} variations
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">
                        LKR {savedListingData.price}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Live
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={handleSummaryCreateNew}
                  className="flex-1"
                >
                  Create New Listing
                </Button>
                <Button onClick={handleSummaryGoToListings} className="flex-1">
                  View All Listings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listing;
