
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { toast } from 'sonner';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user') || 'null');
const accessToken = localStorage.getItem('access_token');

const initialState = {
  user: user || null,
  accessToken: accessToken || null,
  isAuthenticated: !!accessToken,
  isLoading: false,
  error: null,
};

// Register user async thunk
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      // Don't store the token/user on registration, require explicit login
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 
                      error.message || 
                      'Registration failed';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user async thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData);
      toast.success('Login successful!');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || 
                      error.message || 
                      'Login failed';
      toast.error('Login failed: ' + (error.response?.data?.message || 'Invalid credentials'));
      return thunkAPI.rejectWithValue({ 
        message, 
        status: error.response?.status || null 
      });
    }
  }
);

// Logout user async thunk
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      // Clear local state first to prevent dashboard flash
      authService.clearLocalStorage();
      // Then call the API
      await authService.logout();
      return null;
    } catch (error: any) {
      const message = error.response?.data?.message || 
                      error.message || 
                      'Logout failed';
      // Already cleared local storage
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Load user data from token
export const loadUserFromToken = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      return await authService.getCurrentUser();
    } catch (error: any) {
      const message = error.response?.data?.message || 
                      error.message || 
                      'Failed to load user data';
      // If token is invalid, clear it
      if (error.response?.status === 401) {
        authService.clearLocalStorage();
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        // Don't authenticate on registration
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.error = action.payload;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.error = action.payload;
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      })
      // Load user cases
      .addCase(loadUserFromToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loadUserFromToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
