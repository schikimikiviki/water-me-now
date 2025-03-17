import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    api
      .get('/users/check-session', { withCredentials: true })
      .then(() => {
        console.log('AuthContext: is logged in!');
        setLoggedIn(true);
      })
      .catch(() => {
        console.log('AuthContext: is NOT logged in!');
        setLoggedIn(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
