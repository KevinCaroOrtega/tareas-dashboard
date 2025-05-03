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

  // Cargar tareas al iniciar
  useEffect(() => {
    fetch('https://taula.onrender.com/api/tareas')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener las tareas:', error);
        setLoading(false);
      });
  }, []);

  // Manejador de cambios de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };

  // Agregar una nueva tarea
  const handleAddTask = async () => {
    const { tarea, proyecto, responsable, fechaInicio, fechaFin } = newTask;

    if (!tarea || !proyecto || !responsable || !fechaInicio || !fechaFin) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    try {
      const response = await fetch('https://taula.onrender.com/api/tareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error('Error al agregar tarea');
      }

      const data = await response.json();

      setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
      setNewTask({
        tarea: '',
        proyecto: '',
        responsable: '',
        fechaInicio: '',
        fechaFin: '',
        fechaEjecucion: '',
        estado: 'Pendiente',
      });
    } catch (error) {
      console.error('Error al agregar la tarea:', error);
    }
  };

  return (
    <div className="App">
      <h1>Dashboard de Tareas</h1>

      <div className="dashboard">
        <h2>Resumen del Proyecto</h2>
        {/* Aquí puedes añadir gráficos, estadísticas, etc. */}
      </div>

      {loading ? (
        <p>Cargando datos...</p>
      ) : tasks.length === 0 ? (
        <p>No hay tareas disponibles.</p>
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
