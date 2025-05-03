import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // ============= ESTADOS ORIGINALES (MATRIZ) =============
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    tarea: "",
    proyecto: "",
    responsable: "",
    fechaInicio: "",
    fechaFin: "",
    fechaEjecucion: "",
    estado: "Pendiente"
  });

  // ============= FUNCIONES ORIGINALES (MATRIZ) =============
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (response.ok) fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // ============= EFECTOS ORIGINALES (MATRIZ) =============
  useEffect(() => {
    fetchTasks();
  }, []);

  // ============= COMPONENTES VISUALES ACTUALIZADOS =============
  return (
    <div className="dashboard-container">
      {/* Sidebar (nuevo diseño) */}
      <div className="sidebar">
        <div className="profile-header">
          <img className="profile-pic" src="/profile.jpg" alt="Usuario"/>
          <h2>Usuario</h2>
        </div>
        <div className="sidebar-card card-green">
          {tasks.length} Tareas activas
        </div>
      </div>

      {/* Contenido principal (nuevo diseño) */}
      <div className="main-content">
        <div className="header">
          <h1>Mis Tareas</h1>
          <button 
            className="btn btn-primary"
            onClick={() => document.getElementById('task-modal').showModal()}
          >
            + Nueva Tarea
          </button>
        </div>

        {/* Tabla (conserva lógica original) */}
        <table className="task-table">
          <thead>
            <tr>
              <th>Tarea</th>
              <th>Proyecto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.tarea}</td>
                <td>{task.proyecto}</td>
                <td>
                  <span className={`badge ${task.estado.toLowerCase()}`}>
                    {task.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal (misma lógica, nuevo diseño) */}
        <dialog id="task-modal" className="modal">
          <div className="modal-content">
            <h2>Nueva Tarea</h2>
            <input
              type="text"
              placeholder="Nombre tarea"
              value={newTask.tarea}
              onChange={(e) => setNewTask({...newTask, tarea: e.target.value})}
            />
            <button className="btn" onClick={handleAddTask}>
              Guardar
            </button>
          </div>
        </dialog>
      </div>
    </div>
  );
}

export default App;