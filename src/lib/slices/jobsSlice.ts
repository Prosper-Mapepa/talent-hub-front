import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../apiClient';

// Types
export interface Job {
  id: string;
  title: string;
  description: string;
  type: string;
  experienceLevel: string;
  location?: string;
  salary?: string;
  status?: string;
  business: {
    id: string;
    businessName: string;
    businessType: string;
    location?: string;
  };
  applications: Application[];
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  status: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export interface CreateJobData {
  title: string;
  description: string;
  type: string;
  experienceLevel: string;
  businessId: string;
}

export interface UpdateJobData {
  title?: string;
  description?: string;
  type?: string;
  experienceLevel?: string;
}

export interface CreateApplicationData {
  studentId: string;
  jobId: string;
}

export interface JobsState {
  jobs: Job[];
  currentJob: Job | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: JobsState = {
  jobs: [],
  currentJob: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/jobs');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch jobs'
      );
    }
  }
);

export const fetchBusinessJobs = createAsyncThunk(
  'jobs/fetchBusinessJobs',
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/jobs?businessId=${businessId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch business jobs'
      );
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/jobs/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch job'
      );
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (data: CreateJobData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/jobs', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create job'
      );
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, data }: { id: string; data: UpdateJobData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/jobs/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update job'
      );
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/jobs/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete job'
      );
    }
  }
);

export const applyForJob = createAsyncThunk(
  'jobs/applyForJob',
  async ({ jobId, studentId }: { jobId: string; studentId: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/jobs/applications', {
        jobId,
        studentId,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to apply for job'
      );
    }
  }
);

// Jobs slice
const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentJob: (state, action: PayloadAction<Job | null>) => {
      state.currentJob = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Jobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add this block for fetchBusinessJobs
      .addCase(fetchBusinessJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(fetchBusinessJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Job by ID
    builder
      .addCase(fetchJobById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentJob = action.payload;
        state.error = null;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Job
    builder
      .addCase(createJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs.push(action.payload);
        state.error = null;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Job
    builder
      .addCase(updateJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.jobs.findIndex(j => j.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.currentJob?.id === action.payload.id) {
          state.currentJob = action.payload;
        }
        state.error = null;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Job
    builder
      .addCase(deleteJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = state.jobs.filter(j => j.id !== action.payload);
        if (state.currentJob?.id === action.payload) {
          state.currentJob = null;
        }
        state.error = null;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Application
    builder
      .addCase(applyForJob.fulfilled, (state, action) => {
        // Update the job's applications list
        const job = state.jobs.find(j => j.id === action.payload.job.id);
        if (job) {
          job.applications.push(action.payload);
        }
        if (state.currentJob && state.currentJob.id === action.payload.job.id) {
          state.currentJob.applications.push(action.payload);
        }
      });
  },
});

export const { clearError, setCurrentJob } = jobsSlice.actions;
export default jobsSlice.reducer; 