import React, { createContext, useState, useEffect } from 'react';

import authService from '../services/authService';



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If using individual imports:
    // const currentUser = getCurrentUser();
    
    // If using default export:
    const currentUser = authService.getCurrentUser();
    
    setUser(currentUser);
    setLoading(false);
  }, []);

  const loginUser = async (credentials) => {
    // If using individual imports:
    // const data = await login(credentials);
    
    // If using default export:
    const data = await authService.login(credentials);
    
    setUser(data.user);
    return data;
  };

  const registerUser = async (userData) => {
    // If using individual imports:
    // return await register(userData);
    
    // If using default export:
    return await authService.register(userData);
  };

  const logoutUser = () => {
    // If using individual imports:
    // logout();
    
    // If using default export:
    authService.logout();
    
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};