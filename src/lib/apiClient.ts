import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding auth token to request:', config.url);
    } else {
      console.log('No auth token found for request:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Only redirect if not already on login page
        // If this is used in a React context, use router.push('/login') instead
        // If not, document that this should be handled by the caller
      }
    }
    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      console.error('Access forbidden: Insufficient permissions');
    }
    return Promise.reject(error);
  }
);

export default apiClient; 