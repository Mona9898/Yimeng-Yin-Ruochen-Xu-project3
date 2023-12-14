import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function Login() {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setError(''); 
    try {
      const response = await axios.post('http://localhost:8000/api/user/login', {
        username,
        password
      });
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      console.log(response.data.username);
      
      // redirect to user's status updates
      navigate('/user-status-update');
    } catch (error) {
      
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} 
      <form onSubmit={handleSubmit}>
        <label>
          Username: 
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
        </label>
        <br />
        <label>
          Password: 
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </label>
        <br />
        <button type="submit">Login</button> 
      </form>
    </div>
  );
}

export default Login;
