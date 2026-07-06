import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('tm_user');
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });

    const { user } = res.data.data;

    localStorage.setItem('tm_user', JSON.stringify(user));
    setUser(user);
    
    navigate('/board');
  };

  const logout = async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('tm_user');
    localStorage.removeItem('tm_pro');
    setUser(null);
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);