// frontend/src/App.js (FINAL FUNCTIONAL VERSION)
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

  const completeTodo = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/${id}`);
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

  // NEW: Delete Logic
  const deleteTodo = async (id) => {
    try {
      // 1. Tell the backend to delete the item
      const res = await axios.delete(`${API_BASE}/${id}`);
      
      // 2. Filter out the deleted item from the local state
      // This "removes" it from the screen without needing a page refresh
      setTodos(todos => todos.filter(todo => todo._id !== res.data.todo._id));
      
    } catch (err) {
      console.error("Error deleting todo:", err);
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
                <div 
                  className={`todo-text ${todo.completed ? "completed" : ""}`}
                  onClick={() => completeTodo(todo._id)}
                >
                  {todo.text}
                </div>
                {/* Updated Delete Button with onClick */}
                <div 
                  className="delete-todo" 
                  onClick={() => deleteTodo(todo._id)}
                >
                  ✕
                </div>
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