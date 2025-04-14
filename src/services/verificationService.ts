
import api from './apiService';

// Submit verification documents
const submitVerification = async (formData: FormData) => {
  const response = await api.post('/verify-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get all verifications (for admins/subadmins)
const getAllVerifications = async () => {
  const response = await api.get('/verifications');
  return response.data;
};

// Get user verification status
const getUserVerification = async (userId: string) => {
  const response = await api.get(`/user-verification/${userId}`);
  return response.data;
};

// Handle verification (approve/reject)
const handleVerification = async (id: string, action: 'approve' | 'reject') => {
  const response = await api.post(`/handle-verification/${id}`, { action });
  return response.data;
};

const verificationService = {
  submitVerification,
  getAllVerifications,
  getUserVerification,
  handleVerification,
};

export default verificationService;
