import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../apiClient';

// Types
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  major: string;
  year: string;
  bio: string;
  skills: Skill[];
  projects: Project[];
  achievements: Achievement[];
  user: User;
  profileImage?: string | null; // Add this line
}

export interface Skill {
  id: string;
  name: string;
  proficiency: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  technologies?: string[];
  images?: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
  issuer?: string;
  files?: string[];
}

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  major: string;
  year: string;
  availability?: string;
  about?: string;
}

export interface UpdateStudentData {
  firstName?: string;
  lastName?: string;
  major?: string;
  year?: string;
  availability?: string;
  bio?: string;
}

export interface CreateSkillData {
  name: string;
  proficiency: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  url?: string;
  technologies?: string[];
}

export interface CreateAchievementData {
  title: string;
  description: string;
  date: string;
  issuer?: string;
}

// Add this interface to define the students state structure
export interface StudentsState {
  students: Student[];
  student: Student | null; // Add this line
  currentStudent: Student | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: StudentsState = {
  students: [],
  currentStudent: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/students');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch students'
      );
    }
  }
);

export const fetchStudentProfile = createAsyncThunk(
  'students/fetchStudentProfile',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/students/${studentId}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch student profile'
      );
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  'students/fetchStudentById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/students/${id}`);
      return response.data.data;
    } catch (error: any) {
    
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch student'
      );
    }
  }
);

export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (data: CreateStudentData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/students', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create student'
      );
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, data }: { id: string; data: UpdateStudentData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/students/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update student'
      );
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/students/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete student'
      );
    }
  }
);

export const addSkill = createAsyncThunk(
  'students/addSkill',
  async ({ studentId, data }: { studentId: string; data: CreateSkillData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/students/${studentId}/skills`, data);
      return { studentId, skill: response.data.data };
    } catch (error: any) {
      console.log('errorAddingSkill', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add skill'
      );
    }
  }
);

export const addProject = createAsyncThunk(
  'students/addProject',
  async ({ studentId, data }: { studentId: string; data: CreateProjectData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/api/students/${studentId}/projects`, data);
      return { studentId, project: response.data.data };
    } catch (error: any) {
      console.log('errorAddingProject', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add project'
      );
    }
  }
);

export const addAchievement = createAsyncThunk(
  'students/addAchievement',
  async ({ studentId, data }: { studentId: string; data: CreateAchievementData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/students/${studentId}/achievements`, data);
      return { studentId, achievement: response.data.data };
    } catch (error: any) {
      console.log('errorAddingAchievement', error);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add achievement'
      );
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'students/deleteSkill',
  async ({ studentId, skillId }: { studentId: string; skillId: string }, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/students/${studentId}/skills/${skillId}`);
      return { studentId, skillId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete skill'
      );
    }
  }
);

export const updateSkill = createAsyncThunk(
  'students/updateSkill',
  async ({ studentId, skillId, proficiency }: { studentId: string; skillId: string; proficiency: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/students/${studentId}/skills/${skillId}`, { proficiency });
      return { studentId, skillId, proficiency };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update skill'
      );
    }
  }
);

// Students slice
const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentStudent: (state, action: PayloadAction<Student | null>) => {
      state.currentStudent = action.payload;
    },
    clearCurrentStudent: (state) => {
      state.currentStudent = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Students
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload;
        state.error = null;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Student by ID
    builder
      .addCase(fetchStudentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStudent = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Student Profile
    builder
      .addCase(fetchStudentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.student = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Student
    builder
      .addCase(createStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students.push(action.payload);
        state.error = null;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Student
    builder
      .addCase(updateStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        if (state.currentStudent?.id === action.payload.id) {
          state.currentStudent = action.payload;
        }
        state.error = null;
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Student
    builder
      .addCase(deleteStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = state.students.filter(s => s.id !== action.payload);
        if (state.currentStudent?.id === action.payload) {
          state.currentStudent = null;
        }
        state.error = null;
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add Skill
    builder
      .addCase(addSkill.fulfilled, (state, action) => {
        const student = state.students.find(s => s.id === action.payload.studentId);
        if (student) {
          student.skills.push(action.payload.skill);
        }
        if (state.currentStudent?.id === action.payload.studentId) {
          state.currentStudent.skills.push(action.payload.skill);
        }
      });

    // Delete Skill
    builder.addCase(deleteSkill.fulfilled, (state, action) => {
      const { studentId, skillId } = action.payload;
      const student = state.students.find(s => s.id === studentId);
      if (student) {
        student.skills = student.skills.filter(skill => skill.id !== skillId);
      }
      if (state.currentStudent?.id === studentId) {
        state.currentStudent.skills = state.currentStudent.skills.filter(skill => skill.id !== skillId);
      }
    });

    // Update Skill
    builder.addCase(updateSkill.fulfilled, (state, action) => {
      const { studentId, skillId, proficiency } = action.payload;
      const student = state.students.find(s => s.id === studentId);
      if (student) {
        const skill = student.skills.find(skill => skill.id === skillId);
        if (skill) skill.proficiency = proficiency;
      }
      if (state.currentStudent?.id === studentId) {
        const skill = state.currentStudent.skills.find(skill => skill.id === skillId);
        if (skill) skill.proficiency = proficiency;
      }
    });

    // Add Project
    builder
      .addCase(addProject.fulfilled, (state, action) => {
        const student = state.students.find(s => s.id === action.payload.studentId);
        if (student) {
          student.projects.push(action.payload.project);
        }
        if (state.currentStudent?.id === action.payload.studentId) {
          state.currentStudent.projects.push(action.payload.project);
        }
      });

    // Add Achievement
    builder
      .addCase(addAchievement.fulfilled, (state, action) => {
        const student = state.students.find(s => s.id === action.payload.studentId);
        if (student) {
          student.achievements.push(action.payload.achievement);
        }
        if (state.currentStudent?.id === action.payload.studentId) {
          state.currentStudent.achievements.push(action.payload.achievement);
        }
      });
  },
});

export const { clearError, setCurrentStudent, clearCurrentStudent } = studentsSlice.actions;
export default studentsSlice.reducer; 