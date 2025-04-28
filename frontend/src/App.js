import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);  // Estado para controlar si los datos se están cargando

  useEffect(() => {
    // Simulando una llamada a la API
    setTimeout(() => {
      setTasks([
        { id: 1, name: 'Tarea 1', description: 'Descripción de tarea 1' },
        { id: 2, name: 'Tarea 2', description: 'Descripción de tarea 2' },
        { id: 3, name: 'Tarea 3', description: 'Descripción de tarea 3' },
      ]);
      setLoading(false);  // Los datos han sido cargados
    }, 2000);
  }, []); // El arreglo vacío [] asegura que solo se ejecute una vez al montar el componente

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




