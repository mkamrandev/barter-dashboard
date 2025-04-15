
import axios from 'axios';
import { toast } from 'sonner';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if we've already shown an auth error
let hasShownAuthError = false;

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Reset the auth error flag after a successful request
    if (!error) {
      hasShownAuthError = false;
      return Promise.reject(error);
    }
    
    // Only show the auth error once
    if (error.response?.status === 401 && !hasShownAuthError) {
      hasShownAuthError = true;
      toast.error("Authentication error. Please login again.");
      
      // Clear localStorage and redirect to login after a short delay
      setTimeout(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
      }, 1500);
    } else if (error.response?.status === 403) {
      toast.error("You don't have permission to perform this action");
    } else if (error.response?.status === 500) {
      toast.error("Server error. Please try again later.");
    } else if (error.response?.data?.message && !hasShownAuthError) {
      toast.error(error.response.data.message);
    } else if (!hasShownAuthError) {
      // Show a generic error message if no specific error was handled
      toast.error("An error occurred. Please try again.");
    }
    
    return Promise.reject(error);
  }
);

export default api;
