import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { setAuthToken, removeAuthToken } from "../../utils/tokenManager";

// 🏢 PROFESSIONAL: Safe localStorage utility functions
const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      // Handle JSON data
      if (key === "userData") {
        return JSON.parse(item);
      }

      // Handle boolean data
      if (key === "emailVerified") {
        return item === "true";
      }

      return item;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      if (typeof value === "object") {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, String(value));
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  clear: () => {
    try {
      const authKeys = [
        "accessToken",
        "userData",
        "userRole",
        "tenantId",
        "emailVerified",
      ];
      authKeys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error("Error clearing auth data from localStorage:", error);
    }
  },
};

// 🏢 PROFESSIONAL: Initialize state from localStorage (Industry Standard)
const getInitialAuthState = () => {
  const accessToken = storage.get("accessToken");
  const userData = storage.get("userData");
  const userRole = storage.get("userRole");
  const tenantId = storage.get("tenantId");
  const emailVerified = storage.get("emailVerified", false);

  return {
    user: userData,
    accessToken: accessToken,
    userRole: userRole,
    tenantId: tenantId,
    emailVerified: emailVerified,
    isAuthenticated: !!accessToken,
    loading: false,
    error: null,
    success: false,
    message: "",
    resetEmail: null,
    otpVerified: false,
  };
};

// 🏢 PROFESSIONAL: Initial state with complete restoration
const initialState = getInitialAuthState();

// 🏢 PROFESSIONAL: Helper to persist auth data
const persistAuthData = (authData) => {
  storage.set("userData", authData.user);
  storage.set("userRole", authData.userRole);
  storage.set("tenantId", authData.tenantId);
  storage.set("emailVerified", authData.emailVerified);
};

// Async thunks
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const sellerRegistration = createAsyncThunk(
  "auth/sellerRegistration",
  async (sellerData, { rejectWithValue }) => {
    try {
      const response = await authService.sellerRegistration(sellerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Seller registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    console.log("loginUser thunk called with credentials:", credentials);
    try {
      const response = await authService.login(credentials);
      console.log("loginUser thunk response:", response);
      return response.data;
    } catch (error) {
      console.error("loginUser thunk error:", error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      return { ...response.data, email };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset email"
      );
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP({ email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword({
        email,
        newPassword,
        confirmPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed"
      );
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Token refresh failed"
      );
    }
  }
);

// 🏢 PROFESSIONAL: Auth slice with complete persistence
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // Clear tokens (your existing logic)
      removeAuthToken();

      // 🏢 PROFESSIONAL: Clear all auth data from localStorage
      storage.clear();

      // Reset state to initial values
      Object.assign(state, {
        user: null,
        accessToken: null,
        userRole: null,
        tenantId: null,
        emailVerified: false,
        isAuthenticated: false,
        error: null,
        success: false,
        message: "",
        resetEmail: null,
        otpVerified: false,
      });
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = "";
    },
    setTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      setAuthToken(accessToken, refreshToken);
    },
    setResetEmail: (state, action) => {
      state.resetEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 🏢 PROFESSIONAL: Seller Registration with complete persistence
    builder
      .addCase(sellerRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sellerRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        // Update state
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.userRole = action.payload.user.userRole;
        state.tenantId = action.payload.user.tenantId;
        state.emailVerified = action.payload.user.emailVerified;
        state.isAuthenticated = true;

        // 🏢 PROFESSIONAL: Persist complete auth data
        persistAuthData({
          user: action.payload.user,
          userRole: action.payload.user.userRole,
          tenantId: action.payload.user.tenantId,
          emailVerified: action.payload.user.emailVerified,
        });

        setAuthToken(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(sellerRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 🏢 PROFESSIONAL: Login with UPDATED response structure
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        // Extract data from the updated profile structure
        const profile = action.payload.profile;

        // Build complete user object with UPDATED structure including all new fields
        const userData = {
          _id: profile._id,
          userId: action.payload.userId,
          tenantId: action.payload.tenantId,
          userRole: action.payload.userRole,
          emailVerified: action.payload.emailVerified,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          agreeTerms: profile.agreeTerms,

          // 🆕 NEW PROFILE FIELDS from updated response
          bio: profile.bio || "",
          dateOfBirth: profile.dateOfBirth || null,
          gender: profile.gender || null,
          phoneNumber: profile.phoneNumber || null,
          isActive: profile.isActive || true,

          // Business info (for sellers)
          businessInfo: profile.businessInfo || null,
          // Contact info
          contactInfo: profile.contactInfo || null,

          // Wishlist arrays
          productWishlists: profile.productWishlists || [],
          shopWishlists: profile.shopWishlists || [],

          // Legacy wishlist for backwards compatibility
          userWishlist: profile.userWishlist || [],

          // System fields
          otp: profile.otp || null,
          otpExpires: profile.otpExpires || null,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        };

        // Update state
        state.user = userData;
        state.accessToken = action.payload.access_token;
        state.userRole = action.payload.userRole;
        state.tenantId = action.payload.tenantId;
        state.emailVerified = action.payload.emailVerified;
        state.isAuthenticated = true;

        // 🏢 PROFESSIONAL: Persist complete auth data
        persistAuthData({
          user: userData,
          userRole: action.payload.userRole,
          tenantId: action.payload.tenantId,
          emailVerified: action.payload.emailVerified,
        });

        setAuthToken(action.payload.access_token, action.payload.refresh_token);

        console.log("✅ Professional auth persistence complete:", {
          userRole: action.payload.userRole,
          isAuthenticated: true,
          hasUserData: true,
          firstName: profile.firstName,
          lastName: profile.lastName,
          businessName: profile.businessInfo?.businessName || null,
          hasProfileData: !!(
            profile.bio ||
            profile.dateOfBirth ||
            profile.gender
          ),
          phoneNumber: profile.phoneNumber,
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.resetEmail = action.payload.email;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.otpVerified = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.otpVerified = false;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.resetEmail = null;
        state.otpVerified = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 🏢 PROFESSIONAL: Refresh Token handling
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.access_token;
        setAuthToken(action.payload.access_token, action.payload.refresh_token);
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.userRole = null;
        state.tenantId = null;
        state.emailVerified = false;

        // 🏢 PROFESSIONAL: Clear all data on token refresh failure
        removeAuthToken();
        storage.clear();
      });
  },
});

export const { logout, clearError, clearSuccess, setTokens, setResetEmail } =
  authSlice.actions;

// 🆕 ENHANCED SELECTORS: For UI display purposes
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.userRole;
export const selectUser = (state) => state.auth.user;
export const selectLoading = (state) => state.auth.loading;
export const selectError = (state) => state.auth.error;
export const selectSuccess = (state) => state.auth.success;
export const selectMessage = (state) => state.auth.message;
export const selectResetEmail = (state) => state.auth.resetEmail;
export const selectOtpVerified = (state) => state.auth.otpVerified;

// 🆕 NEW SELECTORS: For navbar and profile display
export const selectUserFirstName = (state) => state.auth.user?.firstName || "";
export const selectUserLastName = (state) => state.auth.user?.lastName || "";
export const selectUserFullName = (state) => {
  const user = state.auth.user;
  if (!user) return "";
  return `${user.firstName || ""} ${user.lastName || ""}`.trim();
};
export const selectUserEmail = (state) => state.auth.user?.email || "";
export const selectUserInitials = (state) => {
  const user = state.auth.user;
  if (!user) return "";
  const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || "";
  const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || "";
  return `${firstInitial}${lastInitial}`;
};

// 🆕 UPDATED PROFILE SELECTORS: For the new profile fields
export const selectUserBio = (state) => state.auth.user?.bio || "";
export const selectUserDateOfBirth = (state) =>
  state.auth.user?.dateOfBirth || null;
export const selectUserGender = (state) => state.auth.user?.gender || null;
export const selectUserPhoneNumber = (state) =>
  state.auth.user?.phoneNumber || null;
export const selectUserIsActive = (state) => state.auth.user?.isActive || false;

// 🆕 WISHLIST SELECTORS: For the new wishlist structure
export const selectProductWishlists = (state) =>
  state.auth.user?.productWishlists || [];
export const selectShopWishlists = (state) =>
  state.auth.user?.shopWishlists || [];
export const selectLegacyUserWishlist = (state) =>
  state.auth.user?.userWishlist || [];

// 🆕 BUSINESS SELECTORS: For seller-specific information
export const selectBusinessInfo = (state) =>
  state.auth.user?.businessInfo || null;
export const selectBusinessName = (state) =>
  state.auth.user?.businessInfo?.businessName || "";
export const selectBusinessType = (state) =>
  state.auth.user?.businessInfo?.businessType || "";
export const selectBusinessWebsite = (state) =>
  state.auth.user?.businessInfo?.website || "";
export const selectTaxId = (state) =>
  state.auth.user?.businessInfo?.taxIdOrEIN || "";

// 🆕 CONTACT SELECTORS: For contact information
export const selectContactInfo = (state) =>
  state.auth.user?.contactInfo || null;
export const selectUserAddress = (state) => {
  const contactInfo = state.auth.user?.contactInfo;
  if (!contactInfo) return "";

  const parts = [
    contactInfo.streetAddress,
    contactInfo.city,
    contactInfo.state,
    contactInfo.zipCode,
    contactInfo.country,
  ].filter(Boolean);

  return parts.join(", ");
};
export const selectUserPhone = (state) =>
  state.auth.user?.contactInfo?.phoneNumber ||
  state.auth.user?.phoneNumber ||
  "";

// 🆕 ROLE-BASED SELECTORS: For conditional rendering
export const selectIsSeller = (state) => state.auth.userRole === "seller";
export const selectIsBuyer = (state) => state.auth.userRole === "buyer";

// 🆕 DISPLAY HELPERS: For common UI patterns
export const selectDisplayName = (state) => {
  const user = state.auth.user;
  if (!user) return "User";

  // For sellers, prefer business name if available
  if (state.auth.userRole === "seller" && user.businessInfo?.businessName) {
    return user.businessInfo.businessName;
  }

  // For buyers or sellers without business name, use full name
  return selectUserFullName(state) || user.email || "User";
};

export const selectProfileDisplayInfo = (state) => {
  const user = state.auth.user;
  if (!user) return null;

  return {
    name: selectUserFullName(state),
    email: user.email,
    initials: selectUserInitials(state),
    role: state.auth.userRole,
    businessName: user.businessInfo?.businessName || null,
    displayName: selectDisplayName(state),
    // New profile fields
    bio: user.bio,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    phoneNumber: user.phoneNumber,
    isActive: user.isActive,
  };
};

// 🆕 PROFILE COMPLETION HELPER
export const selectProfileCompleteness = (state) => {
  const user = state.auth.user;
  if (!user) return { percentage: 0, missingFields: [] };

  const requiredFields = ["firstName", "lastName", "email"];
  const optionalFields = ["bio", "dateOfBirth", "gender", "phoneNumber"];

  const completedRequired = requiredFields.filter(
    (field) => user[field]
  ).length;
  const completedOptional = optionalFields.filter(
    (field) => user[field]
  ).length;

  const totalFields = requiredFields.length + optionalFields.length;
  const completedFields = completedRequired + completedOptional;

  const percentage = Math.round((completedFields / totalFields) * 100);

  const missingFields = [
    ...requiredFields.filter((field) => !user[field]),
    ...optionalFields.filter((field) => !user[field]),
  ];

  return {
    percentage,
    missingFields,
    isComplete: percentage === 100,
    hasRequiredFields: completedRequired === requiredFields.length,
  };
};

export default authSlice.reducer;
