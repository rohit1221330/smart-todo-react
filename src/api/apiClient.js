// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Har request ke saath token bhejta hai
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// NAYA CODE: Response Interceptor - Expired token ko handle karega
apiClient.interceptors.response.use(
  // Response successful hone par kuch nahi karna
  (response) => response,
  // Jab response mein error aaye
  async (error) => {
    const originalRequest = error.config;

    // Agar error 401 (Unauthorized) hai aur humne pehle try nahi kiya hai
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);
        
        // Original request ke header mein naya token set karo
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Original request ko firse bhejo
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Agar refresh token bhi fail ho jaaye, toh user ko logout kar do
        console.error("Session expired. Please login again.");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login'; // Login page par bhej do
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;