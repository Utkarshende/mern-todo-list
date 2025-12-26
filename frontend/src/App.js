import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_BASE = `${API_URL}/api/todos`;

function App() {
    const [todos, setTodos] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isRegistering, setIsRegistering] = useState(false);
    const [newTodo, setNewTodo] = useState("");

    const logout = useCallback(() => {
        setToken(null);
        setTodos([]);
        localStorage.removeItem('token');
    }, []);

    const getTodos = useCallback(async () => {
        if (!token) return;
        try {
            const res = await axios.get(API_BASE, {
                headers: { 'x-auth-token': token }
            });
            setTodos(res.data);
        } catch (err) {
            if (err.response?.status === 401) logout();
        }
    }, [token, logout]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            getTodos();
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
        } catch (err) {
            console.error("Add Error:", err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            // Note: Use backticks for the URL string interpolation
            await axios.delete(`${API_BASE}/${id}`, {
                headers: { 'x-auth-token': token }
            });
            // Update UI by removing the deleted item from state
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (err) {
            console.error("Delete Error:", err.message);
            alert("Delete failed. The server might be waking up, please try again.");
        }
    };

    if (!token) {
        return (
            <div className="App">
                <div className="container">
                    <h1>TaskFlow</h1>
                    {isRegistering ? <Register setToken={setToken} /> : <Login setToken={setToken} />}
                    <button className="toggle-auth" onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? "Need an account? Register" : "Have an account? Login"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <div className="container">
                <div className="header-flex">
                    <h2>My Tasks</h2>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
                <div className="add-todo">
                    <input 
                        value={newTodo} 
                        onChange={e => setNewTodo(e.target.value)} 
                        placeholder="Add a task..." 
                    />
                    <button onClick={addTodo}>Add</button>
                </div>
                <div className="todos-list">
                    {todos.map(todo => (
                        <div key={todo._id} className="todo-item">
                            <span>{todo.text}</span>
                            <button onClick={() => deleteTodo(todo._id)} className="delete-btn">
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;