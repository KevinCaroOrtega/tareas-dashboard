import React, { useState, useEffect } from 'react';
import './App.css';
import Sortable from 'sortablejs';

function App() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
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

  const [newProject, setNewProject] = useState({
    nombre: '',
    descripcion: '',
  });

  useEffect(() => {
    // Obtener tareas y proyectos al iniciar
    fetch('https://taula.onrender.com/api/tareas')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar tareas:', err);
        setLoading(false);
      });

    fetch('https://taula.onrender.com/api/projects')
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error('Error al cargar proyectos:', err));
  }, []);

  useEffect(() => {
    // Inicializar SortableJS para el tablero Kanban
    document.querySelectorAll('.kanban-column').forEach((column) => {
      new Sortable(column, {
        group: 'kanban',
        animation: 150,
        ghostClass: 'bg-yellow-100',
      });
    });
  }, [tasks]); // Ejecutamos SortableJS cuando las tareas se cargan o actualizan

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleAddTask = async () => {
    const { tarea, proyecto, responsable, fechaInicio, fechaFin } = newTask;
    if (!tarea || !proyecto || !responsable || !fechaInicio || !fechaFin) {
      alert('Completa todos los campos obligatorios de la tarea.');
      return;
    }

    try {
      const res = await fetch('https://taula.onrender.com/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) throw new Error('Error al agregar tarea');
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
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProject = async () => {
    const { nombre, descripcion } = newProject;
    if (!nombre || !descripcion) {
      alert('Completa todos los campos del proyecto.');
      return;
    }

    try {
      const res = await fetch('https://taula.onrender.com/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (!res.ok) throw new Error('Error al agregar proyecto');
      setProjects([...projects, { ...newProject, id: projects.length + 1 }]);
      setNewProject({ nombre: '', descripcion: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="header bg-blue-500 text-white p-4 text-center">
        <h1>Dashboard de Tareas</h1>
      </header>

      <div className="dashboard p-6 bg-gray-100 rounded-lg shadow-md">
        <h2>Resumen del Proyecto</h2>
        <p>Total de tareas: {tasks.length}</p>
        <p>Total de proyectos: {projects.length}</p>
      </div>

      <div className="section">
        <h2>Proyectos</h2>
        {projects.length === 0 ? (
          <p>No hay proyectos registrados.</p>
        ) : (
          <ul>
            {projects.map((proj) => (
              <li key={proj.id} className="project-item p-4 bg-gray-200 rounded-lg mb-3">
                <strong>{proj.nombre}</strong> - {proj.descripcion}
              </li>
            ))}
          </ul>
        )}

        <h3>Agregar nuevo proyecto</h3>
        <input
          type="text"
          name="nombre"
          value={newProject.nombre}
          placeholder="Nombre del proyecto"
          onChange={handleProjectChange}
        />
        <input
          type="text"
          name="descripcion"
          value={newProject.descripcion}
          placeholder="Descripción"
          onChange={handleProjectChange}
        />
        <button onClick={handleAddProject}>Agregar proyecto</button>
      </div>

      <div className="section">
        <h2>Tareas</h2>
        {loading ? (
          <p>Cargando tareas...</p>
        ) : tasks.length === 0 ? (
          <p>No hay tareas disponibles.</p>
        ) : (
          <div className="kanban-board flex space-x-4">
            <div className="kanban-column bg-blue-100 p-4 rounded-lg w-1/4">
              <h3>Pendiente</h3>
              <ul>
                {tasks.filter(task => task.estado === 'Pendiente').map((task) => (
                  <li key={task.id} className="task-item p-4 bg-gray-200 rounded-lg mb-3">
                    <h3>{task.tarea}</h3>
                    <p><strong>Proyecto:</strong> {task.proyecto}</p>
                    <p><strong>Responsable:</strong> {task.responsable}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="kanban-column bg-yellow-100 p-4 rounded-lg w-1/4">
              <h3>En progreso</h3>
              <ul>
                {tasks.filter(task => task.estado === 'En progreso').map((task) => (
                  <li key={task.id} className="task-item p-4 bg-gray-200 rounded-lg mb-3">
                    <h3>{task.tarea}</h3>
                    <p><strong>Proyecto:</strong> {task.proyecto}</p>
                    <p><strong>Responsable:</strong> {task.responsable}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="kanban-column bg-green-100 p-4 rounded-lg w-1/4">
              <h3>Completadas</h3>
              <ul>
                {tasks.filter(task => task.estado === 'Completada').map((task) => (
                  <li key={task.id} className="task-item p-4 bg-gray-200 rounded-lg mb-3">
                    <h3>{task.tarea}</h3>
                    <p><strong>Proyecto:</strong> {task.proyecto}</p>
                    <p><strong>Responsable:</strong> {task.responsable}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <h3>Agregar nueva tarea</h3>
        <input
          type="text"
          name="tarea"
          value={newTask.tarea}
          placeholder="Nombre de la tarea"
          onChange={handleTaskChange}
        />
        <input
          type="text"
          name="proyecto"
          value={newTask.proyecto}
          placeholder="Proyecto"
          onChange={handleTaskChange}
        />
        <input
          type="text"
          name="responsable"
          value={newTask.responsable}
          placeholder="Responsable"
          onChange={handleTaskChange}
        />
        <input
          type="date"
          name="fechaInicio"
          value={newTask.fechaInicio}
          onChange={handleTaskChange}
        />
        <input
          type="date"
          name="fechaFin"
          value={newTask.fechaFin}
          onChange={handleTaskChange}
        />
        <input
          type="date"
          name="fechaEjecucion"
          value={newTask.fechaEjecucion}
          onChange={handleTaskChange}
        />
        <select name="estado" value={newTask.estado} onChange={handleTaskChange}>
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
