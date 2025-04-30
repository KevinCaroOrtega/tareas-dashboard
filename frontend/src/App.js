import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]); // Estado para almacenar las tareas
  const [loading, setLoading] = useState(true);  // Estado para controlar si los datos se están cargando
  const [error, setError] = useState(null); // Estado para manejar los errores

  useEffect(() => {
    // Llamada a la API para obtener las tareas
    fetch('https://taula.onrender.com/api/tasks')
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudieron cargar las tareas');
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data); // Actualiza el estado con las tareas
        setLoading(false); // Los datos han sido cargados
      })
      .catch((error) => {
        setError(error.message); // Si hay error, se guarda en el estado
        setLoading(false); // Se termina la carga
      });
  }, []); // El arreglo vacío [] asegura que solo se ejecute una vez al montar el componente

  return (
    <div className="App">
      <h1>Dashboard de Tareas</h1>
      {loading ? (
        <p>Cargando datos...</p> // Mensaje mientras se cargan los datos
      ) : error ? (
        <p>Error: {error}</p> // Mensaje de error si algo sale mal
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
