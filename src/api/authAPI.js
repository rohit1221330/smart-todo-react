// src/api/authAPI.js
import apiClient from './apiClient';
import { jwtDecode } from 'jwt-decode'; // Nayi library ko import karein

export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/token/', credentials);
    
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    
    // Token ko decode karke user info return karein
    const user = jwtDecode(response.data.access);
    return { username: user.username }; // Django simple-jwt 'username' field deta hai

  } catch (err) {
    console.error('Login failed:', err);
    throw new Error('Invalid username or password');
  }
};

export const signup = async (userData) => {
  try {
    const response = await apiClient.post('/user/register/', userData);
    return response.data;
  } catch (err) {
    console.error('Signup failed:', err);
    const errorMessage = err.response?.data?.username?.[0] || 'Registration failed.';
    throw new Error(errorMessage);
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

/**
 * Token ko localStorage se nikal kar decode karta hai aur user info deta hai.
 */
export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return null;
    }
    // Token ko decode karein
    const decodedUser = jwtDecode(token);
    // Yahan check kar sakte hain ki token expire toh nahi hua
    if (decodedUser.exp * 1000 < Date.now()) {
        // Token expired
        logout();
        return null;
    }
    return { username: decodedUser.username }; // User object return karein
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};