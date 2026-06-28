import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token with backend
          // const res = await axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
          // setUser(res.data.data);
          
          // Mock successful login for now
          setUser({ id: '1', name: 'Test Customer', email: 'user@quickbite.com', role: 'customer' });
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // const res = await axios.post('/api/auth/login', { email, password });
      // localStorage.setItem('token', res.data.token);
      // setUser(res.data.data);
      
      // Mock login
      localStorage.setItem('token', 'mock-jwt-token');
      setUser({ id: '1', name: 'Test Customer', email: email, role: 'customer' });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
