import api from './apiService';

// Create subadmin
const createSubadmin = async (subadminData) => {
  try {
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

    if (subadminData.firstName && !formData.has('first_name')) {
      formData.append('first_name', subadminData.firstName);
    }
    if (subadminData.lastName && !formData.has('last_name')) {
      formData.append('last_name', subadminData.lastName);
    }

    console.log('Sending subadmin data:', Object.fromEntries(formData.entries()));

    const response = await api.post('/create/subAdmin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating subadmin:', error);
    throw error;
  }
};

// Get all subadmins
const getAllSubadmins = async () => {
  try {
    const response = await api.get('/show-subAdmins');
    return response.data;
  } catch (error) {
    console.error('Error fetching subadmins:', error);
    throw error;
  }
};

// Get inactive subadmins
const getInactiveSubadmins = async () => {
  try {
    const response = await api.get('/inactive-subAdmin');
    return response.data;
  } catch (error) {
    console.error('Error fetching inactive subadmins:', error);
    throw error;
  }
};

// Delete subadmin (soft delete)
const deleteSubadmin = async (id) => {
  const response = await api.delete(`/delete-subAdmin/${id}`);
  return response.data;
};

// Permanently delete subadmin
const permanentlyDeleteSubadmin = async (id) => {
  const response = await api.delete(`/permenant-delete-subAdmin/${id}`);
  return response.data;
};

// Restore subadmin
const restoreSubadmin = async (id) => {
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
