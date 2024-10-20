import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const usernamePattern = /^[a-zA-Z0-9_]+$/;
        if (!usernamePattern.test(username)) {
            setMessage('Username can only contain letters, numbers, and underscores.');
            return;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords don't match");
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', {
                username,
                password,
            });
            setMessage(response.data.message);
            navigate('/login');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error registering user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>register</h2>
            <form onSubmit={handleRegister}>
                <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type='password'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
