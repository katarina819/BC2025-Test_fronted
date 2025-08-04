import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('http://localhost:5227/login', {
      name,
      email,
      rememberMe: true
    }, {
      withCredentials: true,
    });

    console.log('Login successful', response.data);

    // Spremi korisnika u localStorage
    localStorage.setItem("user", JSON.stringify(response.data));

    // (Opcionalno) redirect na Home ako koristiš React Router
    navigate("/");
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
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)} 
        required 
      />
      <button type="submit">Login</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </form>
  );
}
