
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import categoryService from '../../services/categoryService';

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

interface CategoryState {
  categories: Category[];
  category: Category | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: CategoryState = {
  categories: [],
  category: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all categories
export const getCategories = createAsyncThunk(
  'categories/getAll',
  async (_, thunkAPI) => {
    try {
      return await categoryService.getAllCategories();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch categories';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single category
export const getCategoryById = createAsyncThunk(
  'categories/getById',
  async (id: string, thunkAPI) => {
    try {
      return await categoryService.getCategory(id);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch category';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new category
export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData: { name: string; description: string }, thunkAPI) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      toast.success('Category created successfully');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create category';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, categoryData }: { id: string; categoryData: { name: string; description: string } }, thunkAPI) => {
    try {
      const response = await categoryService.updateCategory(id, categoryData);
      toast.success('Category updated successfully');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update category';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id: string, thunkAPI) => {
    try {
      await categoryService.deleteCategory(id);
      toast.success('Category deleted successfully');
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to delete category';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearCategory: (state) => {
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload.data || action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Get single category
      .addCase(getCategoryById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.category = action.payload.data || action.payload;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Create category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories.push(action.payload.data || action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Update category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedCategory = action.payload.data || action.payload;
        state.categories = state.categories.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category
        );
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      // Delete category
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = state.categories.filter((category) => category.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset, clearCategory } = categorySlice.actions;
export default categorySlice.reducer;
