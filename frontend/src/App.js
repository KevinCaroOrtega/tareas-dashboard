import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    tarea: '',
    proyecto: '',
    responsable: '',
    fechaInicio: '',
    fechaFin: '',
    fechaEjecucion: '',
    estado: 'Pendiente',
  });

  useEffect(() => {
    fetch('https://taula.onrender.com/api/tareas')
      .then(response => {
        if (!response.ok) {
          throw new Error("Error en la respuesta de la API");
        }
        return response.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener las tareas:', error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  const handleAddTask = () => {
    if (
      !newTask.tarea ||
      !newTask.proyecto ||
      !newTask.responsable ||
      !newTask.fechaInicio ||
      !newTask.fechaFin
    ) {
      alert('Por favor, complete todos los campos.');
      return;
    }
  
    fetch('https://taula.onrender.com/api/tareas', { // URL correcta y coma eliminada
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error al agregar tarea');
        return response.json(); // Aquí fallaba si backend no enviaba JSON
      })
      .then((data) => {
        setTasks([...tasks, data]);
        setNewTask({ tarea: '', proyecto: '', responsable: '', fechaInicio: '', fechaFin: '', fechaEjecucion: '', estado: 'Pendiente' });
      })
      .catch((error) => {
        console.error('Error al agregar la tarea:', error);
      });
  };

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
            tasks.map((task, index) => (
              <li key={index} className="task-item">
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

      <div>
        <h2>Agregar nueva tarea</h2>
        <input type="text" name="tarea" value={newTask.tarea} placeholder="Nombre de la tarea" onChange={handleChange} />
        <input type="text" name="proyecto" value={newTask.proyecto} placeholder="Proyecto" onChange={handleChange} />
        <input type="text" name="responsable" value={newTask.responsable} placeholder="Responsable" onChange={handleChange} />
        <input type="date" name="fechaInicio" value={newTask.fechaInicio} onChange={handleChange} />
        <input type="date" name="fechaFin" value={newTask.fechaFin} onChange={handleChange} />
        <input type="date" name="fechaEjecucion" value={newTask.fechaEjecucion} onChange={handleChange} />
        <select name="estado" value={newTask.estado} onChange={handleChange}>
          <option value="Pendiente">Pendiente</option>
          <option value="En progreso">En progreso</option>
          <option value="Completada">Completada</option>
        </select>
        <button onClick={handleAddTask}>Agregar tarea</button>
      </div>
    </div>
  );
}

export default App;
