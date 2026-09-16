import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('mediflow_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch { localStorage.removeItem('mediflow_user'); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, id, fullName, role } = res.data;
    const userData = { id, email, fullName, role };
    localStorage.setItem('mediflow_token', token);
    localStorage.setItem('mediflow_user',  JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const { token, id, email: em, fullName, role } = res.data;
    const userData = { id, email: em, fullName, role };
    localStorage.setItem('mediflow_token', token);
    localStorage.setItem('mediflow_user',  JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('mediflow_token');
    localStorage.removeItem('mediflow_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const isAdmin         = () => user?.role === 'ROLE_PHARMACY_ADMIN';
  const isCustomer      = () => user?.role === 'ROLE_CUSTOMER';
  const isDeliveryAgent = () => user?.role === 'ROLE_DELIVERY_AGENT';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isCustomer, isDeliveryAgent }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
