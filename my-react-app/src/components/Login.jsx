import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7276/Account/Login', {
        name,
        password,
        rememberMe: true
      }, {
        withCredentials: true,  // essential for cookie authentication
      });
      console.log('Login successful', response.data);
    } catch (err) {
      console.error('Login error', err);
      setError('Login failed. Check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Name" 
        value={name} 
        onChange={e => setName(e.target.value)} 
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        required 
      />
      <button type="submit">Login</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}
