import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002/api/v1',
  withCredentials: true,
});

// Fetch CSRF token and set it for all requests
api.get('/auth/csrf-token')
  .then(response => {
    api.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
  })
  .catch(error => {
    console.error('Error fetching CSRF token:', error);
  });

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;