
import api from './apiService';

// Get all items
const getAllItems = async () => {
  const response = await api.get('/items');
  console.log("API Response: ", response.data); 
  return response.data;
};

// Get a specific item
const getItem = async (id: string) => {
  const response = await api.get(`/items/${id}`);
  console.log("backend api",response.data)
  return response.data;
};

// Create a new item
const createItem = async (itemData: any) => {
  const formData = new FormData();
  Object.keys(itemData).forEach((key) => {
    if (key !== "images") {
      formData.append(key, itemData[key]);
    }
  });

  if (itemData.images && itemData.images.length > 0) {
    for (let i = 0; i < itemData.images.length; i++) {
      formData.append("images[]", itemData.images[i]);
    }
  }

  const response = await api.post("/items", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Update an item
const updateItem = async (id: string, itemData: any) => {
  const formData = new FormData();
  formData.append('_method', 'PUT');
  
  // Handle regular fields
  Object.keys(itemData).forEach((key) => {
    if (key !== 'images') {
      formData.append(key, itemData[key]);
    }
  });
  
  // Handle images as an array
  if (itemData.images && itemData.images.length > 0) {
    for (let i = 0; i < itemData.images.length; i++) {
      formData.append('images[]', itemData.images[i]);
    }
  }

  const response = await api.post(`/items/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Delete an item
const deleteItem = async (id: string) => {
  const response = await api.delete(`/items/${id}`);
  return response.data;
};

// Approve or reject an item
const approveRejectItem = async (id: string, isApproved: boolean) => {
  const formData = new FormData();
  formData.append('_method', 'PUT');
  formData.append('is_approved', isApproved ? 'approved' : 'rejected');
  
  const response = await api.post(`/item/approveORreject/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const itemService = {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  approveRejectItem
};

export default itemService;
