import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

// This logic uses the environment variable if it exists, otherwise localhost
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_BASE = `${API_URL}/api/todos`;

function App() {
    const [todos, setTodos] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isRegistering, setIsRegistering] = useState(false);
    const [newTodo, setNewTodo] = useState("");

    // Function to logout (defined above useCallback so it's accessible)
    const logout = useCallback(() => {
        setToken(null);
        setTodos([]);
        localStorage.removeItem('token');
    }, []);

    // Function to fetch todos with the Auth Header
    const getTodos = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get(API_BASE, {
                headers: { 'x-auth-token': token }
            });
            setTodos(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
            if (err.response?.status === 401) logout();
        }
    }, [token, logout]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            getTodos();
        } else {
            localStorage.removeItem('token');
        }
    }, [token, getTodos]);

    const addTodo = async () => {
        if (!newTodo.trim()) return;
        try {
            const res = await axios.post(API_BASE, { text: newTodo }, {
                headers: { 'x-auth-token': token }
            });
            setTodos([res.data, ...todos]);
            setNewTodo("");
        } catch (err) { console.error("Add Error:", err); }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API_BASE}/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (err) { console.error("Delete Error:", err); }
    };

    // View Logic
    if (!token) {
        return (
            <div className="App">
                <div className="container">
                    <h1 className="brand-name">TaskFlow</h1>
                    {isRegistering ? <Register setToken={setToken} /> : <Login setToken={setToken} />}
                    <button className="toggle-auth" onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <div className="container">
                <div className="header-flex">
                    <h1>My Tasks</h1>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
                <div className="add-todo">
                    <input 
                        value={newTodo} 
                        onChange={e => setNewTodo(e.target.value)} 
                        placeholder="Add a new task..." 
                        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    />
                    <button onClick={addTodo}>Add</button>
                </div>
                <div className="todos-list">
                    {todos.length === 0 ? <p className="empty-msg">No tasks yet. Add one!</p> : null}
                    {todos.map(todo => (
                        <div key={todo._id} className="todo-item">
                            <span className={todo.completed ? "completed" : ""}>{todo.text}</span>
                            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
                                <i className="fas fa-trash"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;