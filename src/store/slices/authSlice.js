// store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { setAuthToken, removeAuthToken } from '../../utils/tokenManager';

// Initial state
const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  userRole: null,
  tenantId: null,
  emailVerified: false,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,
  error: null,
  success: false,
  message: '',
  resetEmail: null, // For password reset flow
  otpVerified: false,
};

// Async thunks
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Signup failed'
      );
    }
  }
);

export const sellerRegistration = createAsyncThunk(
  'auth/sellerRegistration',
  async (sellerData, { rejectWithValue }) => {
    try {
      const response = await authService.sellerRegistration(sellerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Seller registration failed'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      return { ...response.data, email };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send reset email'
      );
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP({ email, otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'OTP verification failed'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
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
        error.response?.data?.message || 'Password reset failed'
      );
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Token refresh failed'
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      removeAuthToken();
      state.user = null;
      state.accessToken = null;
      state.userRole = null;
      state.tenantId = null;
      state.emailVerified = false;
      state.isAuthenticated = false;
      state.error = null;
      state.success = false;
      state.message = '';
      state.resetEmail = null;
      state.otpVerified = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = '';
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

    // Seller Registration
    builder
      .addCase(sellerRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sellerRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.userRole = action.payload.user.userRole;
        state.tenantId = action.payload.user.tenantId;
        state.emailVerified = action.payload.user.emailVerified;
        state.isAuthenticated = true;
        setAuthToken(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(sellerRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.accessToken = action.payload.access_token;
        state.userRole = action.payload.userRole;
        state.tenantId = action.payload.tenantId;
        state.emailVerified = action.payload.emailVerified;
        state.isAuthenticated = true;
        state.user = {
          userId: action.payload.userId,
          tenantId: action.payload.tenantId,
          userRole: action.payload.userRole,
          emailVerified: action.payload.emailVerified,
        };
        setAuthToken(action.payload.access_token, action.payload.refresh_token);
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

    // Refresh Token
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
        removeAuthToken();
      });
  },
});

export const { logout, clearError, clearSuccess, setTokens, setResetEmail } = authSlice.actions;

// Selectors
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

export default authSlice.reducer;