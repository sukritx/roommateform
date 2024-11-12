import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Fetch CSRF token and set it for all requests
api.get('/api/v1/auth/csrf-token')
  .then(response => {
    api.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
  })
  .catch(error => {
    console.error('Error fetching CSRF token:', error);
  });

export default api;