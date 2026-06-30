import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('adminUser');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (password) => {
    try {
      // Get base URL for api
      let rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      if (rawApiUrl && !rawApiUrl.endsWith('/api') && !rawApiUrl.endsWith('/api/')) {
        rawApiUrl = rawApiUrl.endsWith('/') ? `${rawApiUrl}api` : `${rawApiUrl}/api`;
      }
      
      const response = await axios.post(`${rawApiUrl}/auth/login`, { password }).catch(err => {
        // If server is offline, do a client-side offline login fallback for demo mode!
        if (!err.response) {
          if (password === 'sultan ansari') {
            return {
              data: {
                token: 'mock-admin-token-123456789',
                user: { name: 'Sultan Ansari', email: 'sultan@enterprise.com', isOffline: true }
              }
            };
          }
          throw new Error('Database/Server is offline. Default demo password is "sultan123".');
        }
        throw new Error(err.response?.data?.message || 'Login failed');
      });

      const { token, user: loggedUser } = response.data;
      setUser(loggedUser);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('adminUser', JSON.stringify(loggedUser));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
