import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../apiClient';

// Types
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
}

export interface AdminState {
  userStats: UserStats | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AdminState = {
  userStats: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserStats = createAsyncThunk(
  'admin/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin/user-stats');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user statistics'
      );
    }
  }
);

// Admin slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch User Stats
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userStats = action.payload;
        state.error = null;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer; 