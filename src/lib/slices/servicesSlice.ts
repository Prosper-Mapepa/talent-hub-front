import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../apiClient';

// Types
export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  rating: number;
  provider: {
    id: string;
    name: string;
    avatar?: string;
    initials?: string;
    major?: string;
    year?: string;
  };
  images?: string[];
  deliverables?: string[];
  turnaroundTime?: string;
  revisions?: string;
  additionalServices?: { title: string; price: string }[];
  reviews?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceData {
  title: string;
  description: string;
  price: string;
  category: string;
  providerId: string;
}

export interface UpdateServiceData {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
}

export interface ServicesState {
  services: Service[];
  currentService: Service | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  currentService: null,
  isLoading: false,
  error: null,
};

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/services');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch services'
      );
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'services/fetchServiceById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/services/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch service'
      );
    }
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (data: CreateServiceData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/services', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create service'
      );
    }
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, data }: { id: string; data: UpdateServiceData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/services/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update service'
      );
    }
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/services/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete service'
      );
    }
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentService: (state, action: PayloadAction<Service | null>) => {
      state.currentService = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
        state.error = null;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchServiceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentService = action.payload;
        state.error = null;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services.push(action.payload);
        state.error = null;
      })
      .addCase(createService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.services.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
        if (state.currentService?.id === action.payload.id) {
          state.currentService = action.payload;
        }
        state.error = null;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteService.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = state.services.filter(s => s.id !== action.payload);
        if (state.currentService?.id === action.payload) {
          state.currentService = null;
        }
        state.error = null;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentService } = servicesSlice.actions;
export default servicesSlice.reducer; 