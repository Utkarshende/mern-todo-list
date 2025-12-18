// frontend/src/App.js (COMPLETE FILE WITH TOGGLE LOGIC)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = "http://localhost:5000/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const res = await axios.get(API_BASE);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const addTodo = async () => {
    if (!newTodo) return;
    try {
      const res = await axios.post(API_BASE, { text: newTodo });
      setTodos([res.data, ...todos]);
      setNewTodo("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // NEW: Toggle Completion Logic
  const completeTodo = async (id) => {
    try {
      // Call our backend PUT route
      const res = await axios.put(`${API_BASE}/${id}`);
      
      // Update the local state: find the item by ID and swap it with the updated one
      setTodos(todos => todos.map(todo => {
        if (todo._id === res.data._id) {
          todo.completed = res.data.completed;
        }
        return todo;
      }));

    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>My Tasks</h1>
        
        <div className="add-todo">
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <button onClick={addTodo}>Add</button>
        </div>

        <div className="todos-list">
          {todos.length > 0 ? (
            todos.map(todo => (
              <div className="todo-item" key={todo._id}>
                {/* Clicking the text calls the completeTodo function */}
                <div 
                  className={`todo-text ${todo.completed ? "completed" : ""}`}
                  onClick={() => completeTodo(todo._id)}
                >
                  {todo.text}
                </div>
                <div className="delete-todo">✕</div>
              </div>
            ))
          ) : (
            <p>No tasks yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;