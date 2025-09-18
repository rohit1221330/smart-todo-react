
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authAPI from '../api/authAPI';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initially true to check for user
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // App load hone par user ko check karo
    const userFromToken = authAPI.getCurrentUser();
    if (userFromToken) {
      setUser(userFromToken);
    }
    setLoading(false); // Checking complete
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await authAPI.login(credentials);
      setUser(userData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.signup(userData);
      await login({ username: userData.username, password: userData.password });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    authAPI.logout();
    setUser(null);
    navigate('/login');
  };

  const value = { user, loading, error, login, signup, logout };

  // Jab tak user check ho raha hai, kuch na dikhayein
  if (loading) {
    return null; // Ya aap yahan ek loading spinner dikha sakte hain
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};