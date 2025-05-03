import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

function App() {
  // Estados originales de tareas-dashboard (matriz)
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    tarea: '',
    proyecto: '',
    responsable: '',
    fechaInicio: '',
    fechaFin: '',
    fechaEjecucion: '',
    estado: 'Pendiente'
  });

  // Estados adicionales del dashboard (diseño/funcionalidades)
  const [showModal, setShowModal] = useState(false);
  const [showModalProyecto, setShowModalProyecto] = useState(false);
  const [proyectos, setProyectos] = useState([]);
  const [error, setError] = useState(null);

  // Cargar tareas desde Google Sheets (lógica original de tareas-dashboard)
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      const data = await response.json();
      setTasks(data.data || []);
    } catch (err) {
      setError('Error al cargar tareas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Agregar nueva tarea (adaptado para usar el estado newTask de tareas-dashboard)
  const handleAddTask = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (!response.ok) throw new Error('Error al guardar');
      await fetchTasks();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchTasks();
    // Simular carga de proyectos (del dashboard)
    setProyectos(['Proyecto A', 'Proyecto B']);
  }, []);

  // Componentes visuales del dashboard (simplificados)
  const TaskModal = () => (
    <div className="modal" onClick={() => setShowModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Nueva Tarea</h2>
        <input
          type="text"
          placeholder="Nombre de la tarea"
          value={newTask.tarea}
          onChange={(e) => setNewTask({...newTask, tarea: e.target.value})}
        />
        {/* Resto de campos del formulario */}
        <button onClick={handleAddTask}>Guardar</button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Barra lateral del dashboard */}
      <div className="sidebar">
        <div className="profile-header">
          <h2>Usuario</h2>
          <button className="btn green" onClick={() => setShowModal(true)}>
            + Nueva tarea
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="main-content">
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            {/* Tabla de tareas (estilo dashboard) */}
            <table className="task-table">
              <thead>
                <tr>
                  <th>Tarea</th>
                  <th>Proyecto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.tarea}</td>
                    <td>{task.proyecto}</td>
                    <td>{task.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Modales */}
        {showModal && <TaskModal />}
      </div>
    </div>
  );
}

export default App;