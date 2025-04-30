import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://taula.onrender.com/api/tasks')  // Llama al backend real
      .then(response => response.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener las tareas:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <h1>Dashboard de Tareas</h1>
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <h2>{task.name}</h2>
              <p>{task.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
