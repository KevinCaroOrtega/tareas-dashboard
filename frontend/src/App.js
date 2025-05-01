import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://taula.onrender.com/api/tasks')
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
            <li key={task.id} className="task-item">
              <h2>{task.tarea}</h2>
              <p><strong>Proyecto:</strong> {task.proyecto}</p>
              <p><strong>Responsable:</strong> {task.responsable}</p>
              <p><strong>Inicio:</strong> {task.fechaInicio}</p>
              <p><strong>Fin:</strong> {task.fechaFin}</p>
              <p><strong>Ejecución:</strong> {task.fechaEjecucion}</p>
              <p><strong>Estado:</strong> {task.estado}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

