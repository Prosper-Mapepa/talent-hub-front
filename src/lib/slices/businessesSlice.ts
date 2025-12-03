import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../apiClient';

// Types
export interface Business {
  id: string;
  businessName: string;
  email: string;
  businessType: string;
  location: string;
  description?: string;
  website?: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessData {
  businessName: string;
  email: string;
  businessType: string;
  location: string;
  description?: string;
  website?: string;
}

export interface UpdateBusinessData {
  businessName?: string;
  businessType?: string;
  location?: string;
  description?: string;
  website?: string;
}

export interface BusinessesState {
  businesses: Business[];
  currentBusiness: Business | null;
  business: Business | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: BusinessesState = {
  businesses: [],
  currentBusiness: null,
  business: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchBusinesses = createAsyncThunk(
  'businesses/fetchBusinesses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/businesses');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch businesses'
      );
    }
  }
);

export const fetchBusinessProfile = createAsyncThunk(
  'businesses/fetchBusinessProfile',
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/businesses/${businessId}`);
      // Handle both { data: { business: { ... } } } and { data: { ... } }
      const data = response.data.data;
      return data.business ? data.business : data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch business profile'
      );
    }
  }
);

export const fetchBusinessById = createAsyncThunk(
  'businesses/fetchBusinessById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/businesses/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch business'
      );
    }
  }
);

export const createBusiness = createAsyncThunk(
  'businesses/createBusiness',
  async (data: CreateBusinessData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/businesses', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create business'
      );
    }
  }
);

export const updateBusiness = createAsyncThunk(
  'businesses/updateBusiness',
  async ({ id, data }: { id: string; data: UpdateBusinessData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/businesses/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update business'
      );
    }
  }
);

export const deleteBusiness = createAsyncThunk(
  'businesses/deleteBusiness',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/businesses/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete business'
      );
    }
  }
);

// Businesses slice
const businessesSlice = createSlice({
  name: 'businesses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBusiness: (state, action: PayloadAction<Business | null>) => {
      state.currentBusiness = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Businesses
    builder
      .addCase(fetchBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = action.payload;
        state.error = null;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Business by ID
    builder
      .addCase(fetchBusinessById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBusiness = action.payload;
        state.error = null;
      })
      .addCase(fetchBusinessById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Business
    builder
      .addCase(createBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses.push(action.payload);
        state.error = null;
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Business
    builder
      .addCase(updateBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.businesses.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
        if (state.currentBusiness?.id === action.payload.id) {
          state.currentBusiness = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Business
    builder
      .addCase(deleteBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = state.businesses.filter(b => b.id !== action.payload);
        if (state.currentBusiness?.id === action.payload) {
          state.currentBusiness = null;
        }
        state.error = null;
      })
      .addCase(deleteBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Business Profile
    builder
      .addCase(fetchBusinessProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.business = action.payload;
        state.error = null;
      })
      .addCase(fetchBusinessProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentBusiness } = businessesSlice.actions;
export default businessesSlice.reducer; 