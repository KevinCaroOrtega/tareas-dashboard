import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://taula.onrender.com/api/tasks')
      .then(response => {
        if (!response.ok) {
          console.error("Error en la respuesta:", response);
          throw new Error("Error en la respuesta de la API");
        }
        return response.json();
      })
      .then(data => {
        console.log("Datos recibidos:", data); // Para ver lo que se está recibiendo
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
          {tasks.length === 0 ? (
            <p>No hay tareas disponibles.</p>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className="task-item">
                <h2>{task.tarea}</h2>
                <p><strong>Proyecto:</strong> {task.proyecto}</p>
                <p><strong>Responsable:</strong> {task.responsable}</p>
                <p><strong>Inicio:</strong> {task.fechaInicio}</p>
                <p><strong>Fin:</strong> {task.fechaFin}</p>
                <p><strong>Ejecución:</strong> {task.fechaEjecucion}</p>
                <p><strong>Estado:</strong> {task.estado}</p>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default App;
