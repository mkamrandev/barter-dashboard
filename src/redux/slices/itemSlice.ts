
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import itemService from '../../services/itemService';

export interface Item {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string;
  location: string;
  price_estimate: number;
  status: string;
  is_approved?: boolean;
  images?: string[];
  created_at?: string;
  updated_at?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

interface ItemState {
  items: Item[];
  userItems: Item[];
  item: Item | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: ItemState = {
  items: [],
  userItems: [],
  item: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all items
export const getItems = createAsyncThunk(
  'items/getAll',
  async (_, thunkAPI) => {
    try {
      return await itemService.getAllItems();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch items';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single item
export const getItemById = createAsyncThunk(
  'items/getById',
  async (id: string, thunkAPI) => {
    try {
      return await itemService.getItem(id);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch item';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new item
export const createItem = createAsyncThunk(
  'items/create',
  async (itemData: any, thunkAPI) => {
    try {
      const response = await itemService.createItem(itemData);
      toast.success('Item created successfully');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create item';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update item
export const updateItem = createAsyncThunk(
  'items/update',
  async ({ id, itemData }: { id: string; itemData: any }, thunkAPI) => {
    try {
      const response = await itemService.updateItem(id, itemData);
      toast.success('Item updated successfully');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update item';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete item
export const deleteItem = createAsyncThunk(
  'items/delete',
  async (id: string, thunkAPI) => {
    try {
      await itemService.deleteItem(id);
      toast.success('Item deleted successfully');
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to delete item';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Approve or reject item
export const approveRejectItem = createAsyncThunk(
  'items/approveReject',
  async ({ id, isApproved }: { id: string; isApproved: boolean }, thunkAPI) => {
    try {
      const response = await itemService.approveRejectItem(id, isApproved);
      toast.success(`Item ${isApproved ? 'approved' : 'rejected'} successfully`);
      return { id, isApproved, data: response };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || `Failed to ${isApproved ? 'approve' : 'reject'} item`;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearItem: (state) => {
      state.item = null;
    },
    filterUserItems: (state, action) => {
      const userId = action.payload;
      if (Array.isArray(state.items)) {
        state.userItems = state.items.filter(item => item.user_id === userId);
      } else {
        state.userItems = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all items
      .addCase(getItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Ensure we're setting an array to state.items
        state.items = Array.isArray(action.payload.data) 
          ? action.payload.data 
          : Array.isArray(action.payload) 
            ? action.payload 
            : [];
      })
      .addCase(getItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.items = []; // Ensure it's an empty array on error
      })
      // Get single item
      .addCase(getItemById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getItemById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.item = action.payload.data || action.payload;
      })
      .addCase(getItemById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Create item
      .addCase(createItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const newItem = action.payload.data || action.payload;
        if (Array.isArray(state.items)) {
          state.items.push(newItem);
        } else {
          state.items = [newItem];
        }
      })
      .addCase(createItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Update item
      .addCase(updateItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedItem = action.payload.data || action.payload;
        if (Array.isArray(state.items)) {
          state.items = state.items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          );
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Delete item
      .addCase(deleteItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (Array.isArray(state.items)) {
          state.items = state.items.filter((item) => item.id !== action.payload);
        }
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Approve/Reject item
      .addCase(approveRejectItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveRejectItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { id, isApproved } = action.payload;
        if (Array.isArray(state.items)) {
          state.items = state.items.map((item) =>
            item.id === id ? { ...item, is_approved: isApproved } : item
          );
        }
      })
      .addCase(approveRejectItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset, clearItem, filterUserItems } = itemSlice.actions;
export default itemSlice.reducer;
