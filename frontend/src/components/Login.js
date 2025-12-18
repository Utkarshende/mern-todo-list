import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            setToken(res.data.token); // Pass token up to App.js
        } catch (err) {
            alert(err.response?.data?.msg || "Login Failed");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;