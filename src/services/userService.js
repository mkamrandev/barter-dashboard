
import api from './apiService';

// Get all users
const getAllUsers = async () => {
  try {
    const response = await api.get('/show-users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get inactive users
const getInactiveUsers = async () => {
  try {
    const response = await api.get('/inactive-users');
    return response.data;
  } catch (error) {
    console.error('Error fetching inactive users:', error);
    throw error;
  }
};

// Get specific user
const getUser = async (id: string) => {
  const response = await api.get(`/specified-user/${id}`);
  return response.data;
};

// Update user
const updateUser = async (userData: { id: string; [key: string]: any }) => {
  const { id, ...data } = userData;
  
  // Handle FormData for file upload if profile_picture exists
  const formData = new FormData();
  formData.append('_method', 'put');
  
  Object.keys(data).forEach((key) => {
    if (key === 'profile_picture' && data[key] instanceof File) {
      formData.append(key, data[key]);
    } else if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  const response = await api.post(`/update/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Update password
const updatePassword = async (passwordData: { id: string; oldPassword: string; newPassword: string; confirmPassword: string }) => {
  const { id, ...data } = passwordData;
  
  const formData = new FormData();
  formData.append('_method', 'put');
  formData.append('old_password', data.oldPassword);
  formData.append('new_password', data.newPassword);
  formData.append('confirm_new_password', data.confirmPassword);
  
  const response = await api.post(`/update-password/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete user (soft delete)
const deleteUser = async (id: string) => {
  const response = await api.delete(`/delete/${id}`);
  return response.data;
};

// Permanently delete user
const permanentlyDeleteUser = async (id: string) => {
  const response = await api.delete(`/permenant-delete-user/${id}`);
  return response.data;
};

// Restore user
const restoreUser = async (id: string) => {
  const formData = new FormData();
  formData.append('_method', 'put');
  
  const response = await api.post(`/restore-user/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Create a new user (for admin)
const createUser = async (userData: any) => {
  const formData = new FormData();
  
  Object.keys(userData).forEach((key) => {
    if (key === 'profile_picture' && userData[key] instanceof File) {
      formData.append(key, userData[key]);
    } else if (key === 'password') {
      formData.append('password', userData[key]);
      formData.append('password_confirmation', userData.confirmPassword || userData[key]);
    } else if (key !== 'confirmPassword') {
      formData.append(key, userData[key]);
    }
  });

  const response = await api.post('/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

const userService = {
  getAllUsers,
  getInactiveUsers,
  getUser,
  updateUser,
  updatePassword,
  deleteUser,
  permanentlyDeleteUser,
  restoreUser,
  createUser
};

export default userService;
