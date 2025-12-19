import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setToken }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false); // New: Track loading status

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        
        console.log("Attempting to register with:", formData.email);

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            
            console.log("Registration Successful! Token received.");
            alert("Registration Successful!");
            
            setToken(res.data.token);
        } catch (err) {
            // Detailed error logging
            const errorMsg = err.response?.data?.msg || "Server is not responding";
            console.error("Registration Error:", errorMsg);
            alert("Error: " + errorMsg);
        } finally {
            setLoading(false); // Stop loading regardless of result
        }
    };

    return (
        <div className="auth-container">
            <h2>Create Account</h2>
            <form onSubmit={onSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})} 
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    required 
                    minLength="6"
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default Register;