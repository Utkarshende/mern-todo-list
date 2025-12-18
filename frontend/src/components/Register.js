import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setToken }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            setToken(res.data.token);
        } catch (err) {
            alert(err.response?.data?.msg || "Registration Failed");
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Username" onChange={e => setFormData({...formData, username: e.target.value})} required />
                <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;