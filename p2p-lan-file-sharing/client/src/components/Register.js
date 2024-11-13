import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', { username, password });
      setMessage('Registration successful!');
      console.log(res.data);
    } catch (err) {
      setMessage('Registration failed. Please try again.');
      console.error(err.response.data);
    }
  };

  return (
    <div className="container">
      <h2 className="card-title">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="Username"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default Register;
