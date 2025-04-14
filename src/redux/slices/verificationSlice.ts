
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import verificationService from '../../services/verificationService';
import { toast } from 'sonner';

interface VerificationDocument {
  id: string;
  user_id: string;
  user_name?: string;
  profile_picture?: string;
  cnic_front?: string;
  cnic_back?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

interface VerificationState {
  verifications: VerificationDocument[];
  userVerification: VerificationDocument | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: VerificationState = {
  verifications: [],
  userVerification: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Submit verification documents
export const submitVerification = createAsyncThunk(
  'verification/submit',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await verificationService.submitVerification(formData);
      toast.success('Verification documents submitted successfully');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to submit verification documents';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all pending verifications (for admins/subadmins)
export const getAllVerifications = createAsyncThunk(
  'verification/getAll',
  async (_, thunkAPI) => {
    try {
      return await verificationService.getAllVerifications();
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch verifications';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user verification status
export const getUserVerification = createAsyncThunk(
  'verification/getUserVerification',
  async (userId: string, thunkAPI) => {
    try {
      return await verificationService.getUserVerification(userId);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch user verification status';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Handle verification (approve/reject)
export const handleVerification = createAsyncThunk(
  'verification/handle',
  async ({ id, action }: { id: string; action: 'approve' | 'reject' }, thunkAPI) => {
    try {
      const response = await verificationService.handleVerification(id, action);
      toast.success(`Verification ${action}ed successfully`);
      return { ...response, id, action };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || `Failed to ${action} verification`;
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verificationSlice = createSlice({
  name: 'verification',
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
      // SubmitVerification
      .addCase(submitVerification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitVerification.fulfilled, (state, action: PayloadAction<VerificationDocument>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userVerification = action.payload;
      })
      .addCase(submitVerification.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // GetAllVerifications
      .addCase(getAllVerifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllVerifications.fulfilled, (state, action: PayloadAction<VerificationDocument[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.verifications = action.payload;
      })
      .addCase(getAllVerifications.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // GetUserVerification
      .addCase(getUserVerification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserVerification.fulfilled, (state, action: PayloadAction<VerificationDocument>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userVerification = action.payload;
      })
      .addCase(getUserVerification.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // HandleVerification
      .addCase(handleVerification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleVerification.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { id, action: verificationAction } = action.payload;
        state.verifications = state.verifications.map(verification => 
          verification.id === id 
            ? { ...verification, status: verificationAction === 'approve' ? 'approved' : 'rejected' } 
            : verification
        );
      })
      .addCase(handleVerification.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = verificationSlice.actions;
export default verificationSlice.reducer;
