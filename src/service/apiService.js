import axios from 'axios';

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Replace with your API base URL
  timeout: 5000, // Set timeout
  headers: {
    'Content-Type': 'application/json', // Default content type for all requests
  },
});

// Request interceptor to include the token in headers
apiClient.interceptors.request.use(
  (config) => {
    // Assuming the token is stored in localStorage (or any other secure storage)
    const token = localStorage.getItem('authToken');

    // If a token exists, add it to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle errors in the request setup
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses globally (optional)
apiClient.interceptors.response.use(
  (response) => {
    // Modify or log the response if needed
    return response;
  },
  (error) => {
    // Handle global response errors, like token expiration
    if (error.response && error.response.status === 401) {
      // For example, redirect to login if unauthorized (401)
      console.error('Unauthorized! Redirecting to login...');
      // Optionally, you could clear the token and redirect to login page
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service with common methods
const apiService = {
  // GET request
  get: async (endpoint, params = {}) => {
    try {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (endpoint, data) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (endpoint, data) => {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (endpoint) => {
    try {
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;
