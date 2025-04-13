
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import subadminService from '../../services/subadminService';
import { toast } from 'sonner';

// Define a type for subadmin
interface Subadmin {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  permissions?: string;
  avatar?: string;
  [key: string]: any;
}

// Define the state type
interface SubadminState {
  subadmins: Subadmin[];
  inactiveSubadmins: Subadmin[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: SubadminState = {
  subadmins: [],
  inactiveSubadmins: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Create subadmin
export const createSubadmin = createAsyncThunk(
  'subadmins/create',
  async (subadminData: any, thunkAPI) => {
    try {
      const response = await subadminService.createSubadmin(subadminData);
      toast.success('Subadmin created successfully');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create subadmin';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all subadmins
export const getAllSubadmins = createAsyncThunk(
  'subadmins/getAll',
  async (_, thunkAPI) => {
    try {
      return await subadminService.getAllSubadmins();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch subadmins';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get inactive subadmins
export const getInactiveSubadmins = createAsyncThunk(
  'subadmins/getInactive',
  async (_, thunkAPI) => {
    try {
      return await subadminService.getInactiveSubadmins();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch inactive subadmins';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete subadmin (soft delete)
export const deleteSubadmin = createAsyncThunk(
  'subadmins/delete',
  async (id: string, thunkAPI) => {
    try {
      const response = await subadminService.deleteSubadmin(id);
      toast.success('Subadmin deleted successfully');
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to delete subadmin';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Permanently delete subadmin
export const permanentlyDeleteSubadmin = createAsyncThunk(
  'subadmins/permanentlyDelete',
  async (id: string, thunkAPI) => {
    try {
      const response = await subadminService.permanentlyDeleteSubadmin(id);
      toast.success('Subadmin permanently deleted');
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to permanently delete subadmin';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Restore subadmin
export const restoreSubadmin = createAsyncThunk(
  'subadmins/restore',
  async (id: string, thunkAPI) => {
    try {
      const response = await subadminService.restoreSubadmin(id);
      toast.success('Subadmin restored successfully');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to restore subadmin';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const subadminSlice = createSlice({
  name: 'subadmins',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // CreateSubadmin
      .addCase(createSubadmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSubadmin.fulfilled, (state, action: PayloadAction<Subadmin>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.subadmins.push(action.payload);
      })
      .addCase(createSubadmin.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // GetAllSubadmins
      .addCase(getAllSubadmins.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSubadmins.fulfilled, (state, action: PayloadAction<Subadmin[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.subadmins = action.payload;
      })
      .addCase(getAllSubadmins.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // GetInactiveSubadmins
      .addCase(getInactiveSubadmins.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInactiveSubadmins.fulfilled, (state, action: PayloadAction<Subadmin[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.inactiveSubadmins = action.payload;
      })
      .addCase(getInactiveSubadmins.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // DeleteSubadmin
      .addCase(deleteSubadmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSubadmin.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.subadmins = state.subadmins.filter(subadmin => subadmin.id !== action.payload);
      })
      .addCase(deleteSubadmin.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // PermanentlyDeleteSubadmin
      .addCase(permanentlyDeleteSubadmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(permanentlyDeleteSubadmin.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.subadmins = state.subadmins.filter(subadmin => subadmin.id !== action.payload);
        state.inactiveSubadmins = state.inactiveSubadmins.filter(subadmin => subadmin.id !== action.payload);
      })
      .addCase(permanentlyDeleteSubadmin.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // RestoreSubadmin
      .addCase(restoreSubadmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreSubadmin.fulfilled, (state, action: PayloadAction<Subadmin>) => {
        state.isLoading = false;
        state.isSuccess = true;
        const restoredSubadmin = action.payload;
        state.inactiveSubadmins = state.inactiveSubadmins.filter(subadmin => subadmin.id !== restoredSubadmin.id);
        state.subadmins = [...state.subadmins, restoredSubadmin];
      })
      .addCase(restoreSubadmin.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = subadminSlice.actions;
export default subadminSlice.reducer;
