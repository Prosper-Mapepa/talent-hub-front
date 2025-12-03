import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentsReducer from './slices/studentsSlice';
import businessesReducer from './slices/businessesSlice';
import jobsReducer from './slices/jobsSlice';
import messagesReducer from './slices/messagesSlice';
import adminReducer from './slices/adminSlice';
import servicesReducer from './slices/servicesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentsReducer,
    businesses: businessesReducer,
    jobs: jobsReducer,
    messages: messagesReducer,
    admin: adminReducer,
    services: servicesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 