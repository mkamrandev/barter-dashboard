
import api from './apiService';

// Create subadmin
const createSubadmin = async (subadminData: any) => {
  // Handle FormData for file upload
  const formData = new FormData();
  
  Object.keys(subadminData).forEach((key) => {
    if (key === 'profile_picture' && subadminData[key] instanceof File) {
      formData.append(key, subadminData[key]);
    } else if (key === 'password') {
      formData.append('password', subadminData[key]);
      formData.append('confirm_password', subadminData.confirmPassword || subadminData[key]);
    } else if (key !== 'confirmPassword') {
      formData.append(key, subadminData[key]);
    }
  });

  const response = await api.post('/create/subAdmin', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Get all subadmins
const getAllSubadmins = async () => {
  const response = await api.get('/show-subAdmins');
  return response.data;
};

// Get inactive subadmins
const getInactiveSubadmins = async () => {
  const response = await api.get('/inactive-subAdmin');
  return response.data;
};

// Delete subadmin (soft delete)
const deleteSubadmin = async (id: string) => {
  const response = await api.delete(`/delete-subAdmin/${id}`);
  return response.data;
};

// Permanently delete subadmin
const permanentlyDeleteSubadmin = async (id: string) => {
  const response = await api.delete(`/permenant-delete-subAdmin/${id}`);
  return response.data;
};

// Restore subadmin
const restoreSubadmin = async (id: string) => {
  const formData = new FormData();
  formData.append('_method', 'put');
  
  const response = await api.post(`/restore-subAdmin/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const subadminService = {
  createSubadmin,
  getAllSubadmins,
  getInactiveSubadmins,
  deleteSubadmin,
  permanentlyDeleteSubadmin,
  restoreSubadmin
};

export default subadminService;
