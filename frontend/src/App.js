import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = "http://localhost:5000/api/todos";

function App() {
  // Always initialize as an empty array []
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const res = await axios.get(API_BASE);
      // Safety check: ensure data is an array
      if (Array.isArray(res.data)) {
        setTodos(res.data);
      } else {
        setTodos([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setTodos([]);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const res = await axios.post(API_BASE, { text: newTodo });
      // Always use the spread operator to keep it an array
      setTodos(prev => [res.data, ...prev]);
      setNewTodo("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const completeTodo = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/${id}`);
      setTodos(prev => prev.map(todo => 
        todo._id === res.data._id ? { ...todo, completed: res.data.completed } : todo
      ));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      // FIX: We filter the current state 'prev' to remove the item.
      // We do NOT use res.data here because the backend returns a message object, not the full list.
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  // Helper to ensure we don't call .filter on a non-array in the JSX
  const safeTodos = Array.isArray(todos) ? todos : [];

  return (
    <div className="App">
      <div className="container">
        <h1>My Tasks</h1>
        <p className="stats">
          {safeTodos.filter(t => t.completed).length} of {safeTodos.length} tasks completed
        </p>
        
        <div className="add-todo">
          <input 
            type="text" 
            placeholder="What's your next task?" 
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <div className="todos-list">
          {safeTodos.length > 0 ? (
            safeTodos.map(todo => (
              <div className="todo-item" key={todo._id}>
                <div 
                  className={`todo-text ${todo.completed ? "completed" : ""}`}
                  onClick={() => completeTodo(todo._id)}
                >
                  {todo.text}
                </div>
                <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
                  ✕
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No tasks found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;