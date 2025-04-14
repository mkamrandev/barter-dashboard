
import axios from 'axios';

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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      clearLocalStorage();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Save user data and token to localStorage
const saveUserData = (userData, accessToken) => {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('userRole', userData.role);
};

// Clear user data from localStorage
const clearLocalStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('userRole');
};

// Register user
const register = async (userData) => {
  // Handle FormData for file upload
  const formData = new FormData();
  
  Object.keys(userData).forEach((key) => {
    if (key === 'profile_picture' && userData[key] instanceof File) {
      formData.append(key, userData[key]);
    } else {
      formData.append(key, userData[key]);
    }
  });

  const response = await api.post('/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  if (response.data && response.data.access_token) {
    saveUserData(response.data.user, response.data.access_token);
  }
  
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  
  if (response.data && response.data.access_token) {
    saveUserData(response.data.user, response.data.access_token);
  }
  
  return response.data;
};

// Logout user
const logout = async () => {
  try {
    const response = await api.get('/auth/logout');
    clearLocalStorage();
    return response.data;
  } catch (error) {
    clearLocalStorage();
    throw error;
  }
};

// Get current user data
const getCurrentUser = async () => {
  const response = await api.get('/auth/user');
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  clearLocalStorage,
};

export default authService;
