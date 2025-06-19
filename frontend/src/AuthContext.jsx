import { createContext, useContext, useState, useEffect } from 'react';
import api from './api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    try {
      await api.get('/auth/check', { withCredentials: true });
      setLoggedIn(true);
    } catch {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, checkLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
