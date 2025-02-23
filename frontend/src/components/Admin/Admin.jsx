import { useState } from 'react';
import api from '../../api/axiosConfig';
import './Admin.css';

function Admin() {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post(
        '/users/login',
        { username: username, password: password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      // Handle successful login
      console.log('Login successful:', response.data);

      const authToken = btoa(`${username}:${password}`);
      localStorage.setItem('authToken', authToken);
    } catch (error) {
      // Handle login error
      console.error('Login failed:', error.message || error);
    }
  };

  return (
    <div className='page-div'>
      <h1>Login</h1>
      <form onSubmit={handleLogin} role='form'>
        <input
          type='text'
          id='username'
          name='username'
          placeholder='Enter your Username'
          value={username}
          onChange={handleUserNameChange}
          required
        />
        <input
          type='password'
          id='password'
          name='password'
          placeholder='Enter your Password'
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <br /> <br />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}

export default Admin;
