
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import userService from '../../services/userService';
import { toast } from 'sonner';

// Define a type for user
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  [key: string]: any;
}

// Define the state type
interface UserState {
  users: User[];
  inactiveUsers: User[];
  selectedUser: User | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: UserState = {
  users: [],
  inactiveUsers: [],
  selectedUser: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all users
export const getAllUsers = createAsyncThunk(
  'users/getAll',
  async (_, thunkAPI) => {
    try {
      return await userService.getAllUsers();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch users';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get inactive users
export const getInactiveUsers = createAsyncThunk(
  'users/getInactive',
  async (_, thunkAPI) => {
    try {
      return await userService.getInactiveUsers();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch inactive users';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get specific user
export const getUser = createAsyncThunk(
  'users/getUser',
  async (id: string, thunkAPI) => {
    try {
      return await userService.getUser(id);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch user details';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (userData: { id: string; [key: string]: any }, thunkAPI) => {
    try {
      const response = await userService.updateUser(userData);
      toast.success('User updated successfully');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update user';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update password
export const updatePassword = createAsyncThunk(
  'users/updatePassword',
  async (passwordData: { id: string; oldPassword: string; newPassword: string; confirmPassword: string }, thunkAPI) => {
    try {
      const response = await userService.updatePassword(passwordData);
      toast.success('Password updated successfully');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update password';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete user (soft delete)
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, thunkAPI) => {
    try {
      const response = await userService.deleteUser(id);
      toast.success('User deleted successfully');
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to delete user';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Permanently delete user
export const permanentlyDeleteUser = createAsyncThunk(
  'users/permanentlyDeleteUser',
  async (id: string, thunkAPI) => {
    try {
      const response = await userService.permanentlyDeleteUser(id);
      toast.success('User permanently deleted');
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to permanently delete user';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Restore user
export const restoreUser = createAsyncThunk(
  'users/restoreUser',
  async (id: string, thunkAPI) => {
    try {
      const response = await userService.restoreUser(id);
      toast.success('User restored successfully');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to restore user';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
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
      // GetAllUsers
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // GetInactiveUsers
      .addCase(getInactiveUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInactiveUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.inactiveUsers = action.payload;
      })
      .addCase(getInactiveUsers.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // GetUser
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedUser = action.payload;
      })
      .addCase(getUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // UpdateUser
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedUser = action.payload;
        state.users = state.users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        );
        state.selectedUser = updatedUser;
      })
      .addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // DeleteUser
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // PermanentlyDeleteUser
      .addCase(permanentlyDeleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(permanentlyDeleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.inactiveUsers = state.inactiveUsers.filter(user => user.id !== action.payload);
      })
      .addCase(permanentlyDeleteUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // RestoreUser
      .addCase(restoreUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        const restoredUser = action.payload;
        state.inactiveUsers = state.inactiveUsers.filter(user => user.id !== restoredUser.id);
        state.users = [...state.users, restoredUser];
      })
      .addCase(restoreUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
