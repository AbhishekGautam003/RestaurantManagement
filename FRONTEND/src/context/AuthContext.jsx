import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    console.log('AuthContext.login called with:', { userData, token: authToken ? 'present' : 'missing' });
    
    if (!userData || !authToken) {
      console.error('Invalid login data:', { userData, authToken });
      throw new Error('Invalid login data');
    }

    setUser(userData);
    setToken(authToken);
    
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
      console.log('Auth data saved to localStorage');
    } catch (error) {
      console.error('Failed to save auth to localStorage:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
