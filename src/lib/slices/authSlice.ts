import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../apiClient';

// Types
export interface User {
  id: string;
  email: string;
  role: 'student' | 'business' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  firstName?: string;
  lastName?: string;
  businessName?: string;
  createdAt: string;
  updatedAt: string;
  studentId?: string; // <-- Add this line
  businessId?: string; // <-- Added for business users
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterStudentData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  major: string;
  year: string;
  agreedToTerms: boolean;
}

export interface RegisterBusinessData {
  businessName: string;
  email: string;
  password: string;
  businessType: string;
  location: string;
  agreedToTerms: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Initial state
const getInitialAuthState = (): AuthState => {
  let token = null;
  let user = null;
  let isAuthenticated = false;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      user = JSON.parse(userStr);
      isAuthenticated = true;
    }
  }
  return {
    user,
    token,
    isAuthenticated,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialAuthState();

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (loginDto: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', loginDto);
      const { access_token, user, student, business } = response.data.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', access_token);
        localStorage.setItem('user', JSON.stringify({
          ...user,
          firstName: student?.firstName,
          lastName: student?.lastName,
          studentId: student?.id,
          businessId: business?.id,
        }));
      }
      return {
        token: access_token,
        user: {
          ...user,
          firstName: student?.firstName,
          lastName: student?.lastName,
          studentId: student?.id,
          businessId: business?.id,
        },
        student,
        business,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const registerStudent = createAsyncThunk(
  'auth/registerStudent',
  async (data: RegisterStudentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/register-student', data);
      const { access_token, user, student } = response.data.data;
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', access_token);
        localStorage.setItem('user', JSON.stringify({ ...user, firstName: student?.firstName, lastName: student?.lastName, studentId: student?.id }));
      }
      return { token: access_token, user: { ...user, firstName: student?.firstName, lastName: student?.lastName, studentId: student?.id }, student };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const registerBusiness = createAsyncThunk(
  'auth/registerBusiness',
  async (data: RegisterBusinessData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/register-business', data);
      const { access_token, user, business } = response.data.data;
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', access_token);
        localStorage.setItem('user', JSON.stringify({ ...user, businessId: business?.id }));
      }
      return { token: access_token, user: { ...user, businessId: business?.id }, business };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      return null;
    } catch (error: any) {
      return rejectWithValue('Logout failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register Student
    builder
      .addCase(registerStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register Business
    builder
      .addCase(registerBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { setCredentials, clearCredentials, setError, clearError } = authSlice.actions;
export default authSlice.reducer; 