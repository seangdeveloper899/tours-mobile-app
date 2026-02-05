import React, { createContext, useState, useContext, useEffect } from 'react';
import { authStorage } from '../utils/authStorage';
import { authAPI } from '../config/apiService';
import api from '../config/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user and token from storage on app start
  useEffect(() => {
    loadAuthData();
  }, []);

  // Set authorization header when token changes
  useEffect(() => {
    if (token) {
      console.log('Setting auth header with token:', token.substring(0, 20) + '...');
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      console.log('Removing auth header');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const loadAuthData = async () => {
    try {
      const storedToken = await authStorage.getToken();
      const storedUser = await authStorage.getUser();

      console.log('Loading auth data:', { hasToken: !!storedToken, hasUser: !!storedUser });

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        // Ensure the header is set immediately
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const { user: userData, token: authToken } = response.data;
        
        // Set token in headers immediately
        api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
        await authStorage.saveToken(authToken);
        await authStorage.saveUser(userData);
        
        setToken(authToken);
        setUser(userData);
        
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
      };
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const response = await authAPI.register(name, email, phone, password);
      
      if (response.success) {
        const { user: userData, token: authToken } = response.data;
        
        // Set token in headers immediately
        api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        
        await authStorage.saveToken(authToken);
        await authStorage.saveUser(userData);
        
        setToken(authToken);
        setUser(userData);
        
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
        errors: error.response?.data?.errors || {},
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await authStorage.clearAll();
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      
      if (response.success) {
        const updatedUser = response.data;
        await authStorage.saveUser(updatedUser);
        setUser(updatedUser);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed. Please try again.',
        errors: error.response?.data?.errors || {},
      };
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      
      if (response.success) {
        const userData = response.data;
        await authStorage.saveUser(userData);
        setUser(userData);
      }
    } catch (error) {
      console.error('Refresh profile error:', error);
      // If token is invalid, logout
      if (error.response?.status === 401) {
        await logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
