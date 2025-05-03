import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

function App() {
  // Estados del primer repositorio (tareas-dashboard)
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

  // Estados del segundo repositorio (dashboard)
  const [showModal, setShowModal] = useState(false);
  const [showModalProyecto, setShowModalProyecto] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [proyectos, setProyectos] = useState([]);
  const [error, setError] = useState(null);

  // Cargar tareas (del primer repositorio)
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

  // Agregar tarea (adaptado para ambos)
  const handleAddTask = async () => {
    if (!newTask.tarea || !newTask.proyecto || !newTask.responsable) {
      setError('Complete todos los campos');
      return;
    }

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

  useEffect(() => {
    fetchTasks();
    // Simular carga de proyectos (del dashboard)
    setProyectos(['Proyecto A', 'Proyecto B']);
  }, []);

  // Componente de Calendario (del dashboard)
  const renderCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const today = new Date();

    return (
      <div className="calendar-view">
        <div className="calendar-header">
          <button onClick={() => setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1))}>
            &lt; Anterior
          </button>
          <h2>
            {new Date(currentYear, currentMonth).toLocaleDateString('es-ES', {
              month: 'long',
              year: 'numeric'
            }).toUpperCase()}
          </h2>
          <button onClick={() => setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1))}>
            Siguiente &gt;
          </button>
        </div>
        <div className="calendar-grid">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
          {[...Array(firstDay).fill(null), ...Array(daysInMonth).keys()].map((day, i) => (
            <div 
              key={i} 
              className={`calendar-day ${day === null ? 'empty' : ''} ${
                day === today.getDate() && currentMonth === today.getMonth() ? 'today' : ''
              }`}
            >
              {day !== null && day + 1}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar (del dashboard) */}
      <div className="sidebar">
        <div className="profile-header">
          <div className="profile-actions">
            <span className="profile-link">Cerrar sesión</span>
          </div>
          <div className="profile-info">
            <img 
              className="profile-pic" 
              src="/default-profile.png" 
              alt="Profile"
            />
            <h2 className="user-name">Usuario</h2>
            <p className="user-email">usuario@ejemplo.com</p>
          </div>
        </div>
        <div className="sidebar-card card-green">
          {tasks.filter(t => t.estado === 'Pendiente').length} tareas pendientes
        </div>
        <div className="sidebar-card card-blue">Reunión con el equipo</div>
        <div className="sidebar-card card-yellow">
          {tasks.length} tareas totales
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="greeting-container">
            <h1 className="greeting">¡Buenos días!</h1>
            <p className="subtitle">
              {tasks.length === 0 
                ? 'No tienes tareas' 
                : `Tienes ${tasks.length} tarea${tasks.length !== 1 ? 's' : ''}`
              }
            </p>
            <div className="action-buttons">
              <button 
                className="btn calendar-btn" 
                onClick={() => setShowCalendar(!showCalendar)}
              >
                {showCalendar ? 'Ocultar' : 'Mostrar'} Calendario
              </button>
            </div>
          </div>
          <div className="header-buttons">
            <button 
              className="btn green" 
              onClick={() => setShowModal(true)}
            >
              + Nueva tarea
            </button>
          </div>
        </div>

        {error && (
          <div className="toast-message">
            {error}
          </div>
        )}

        {showCalendar ? (
          renderCalendar()
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th>Tarea</th>
                <th>Proyecto</th>
                <th>Responsable</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>{task.tarea}</td>
                  <td>{task.proyecto}</td>
                  <td>{task.responsable}</td>
                  <td>{task.fechaInicio}</td>
                  <td>{task.fechaFin}</td>
                  <td>
                    <span className={`estado estado-${task.estado.toLowerCase()}`}>
                      {task.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal de Tarea (del dashboard) */}
        {showModal && (
          <div className="modal" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>Nueva Tarea</h2>
              <div className="input-container">
                <label>Nombre de la tarea *</label>
                <input
                  type="text"
                  value={newTask.tarea}
                  onChange={(e) => setNewTask({...newTask, tarea: e.target.value})}
                  required
                />
              </div>
              <div className="input-container">
                <label>Proyecto *</label>
                <select
                  value={newTask.proyecto}
                  onChange={(e) => setNewTask({...newTask, proyecto: e.target.value})}
                  required
                >
                  <option value="">Seleccione...</option>
                  {proyectos.map(proyecto => (
                    <option key={proyecto} value={proyecto}>{proyecto}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-confirm"
                  onClick={handleAddTask}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;