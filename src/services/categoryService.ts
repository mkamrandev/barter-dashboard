
import api from './apiService';

// Get all categories
const getAllCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Get a specific category
const getCategory = async (id: string) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Create a new category
const createCategory = async (categoryData: any) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

// Update a category
const updateCategory = async (id: string, categoryData: any) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

// Delete a category
const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

const categoryService = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};

export default categoryService;
