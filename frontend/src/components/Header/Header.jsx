import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../AuthContext.jsx';

function Header() {
  const { isLoggedIn } = useAuth();

  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       await api.get('/auth/check', { withCredentials: true });
  //       setLoggedIn(true);
  //     } catch (err) {
  //       setLoggedIn(false);
  //       console.error('Check login failed:', err);
  //     }
  //   };

  //   checkLoginStatus();
  // }, []);

  return (
    <div
      style={{
        padding: '30px',
        top: '0px',
        border: '2px solid white',
        borderRadius: '20px',
        margin: '30px',
        backgroundColor: '#95b8d1',
        width: '90vw',
      }}
    >
      <h2 style={{ textAlign: 'right', fontSize: '16px', marginTop: '-15px' }}>
        Version 1.0
      </h2>
      <h1>🪴 water me now 🪴</h1>
      <hr style={{ width: '500px', marginLeft: '0' }}></hr>
      <p style={{ fontSize: '22px', marginLeft: '100px' }}>
        Plant management app
      </p>
      <div style={{ textAlign: 'right' }}>
        You are logged {isLoggedIn ? 'in' : 'out'}
      </div>
    </div>
  );
}

export default Header;
