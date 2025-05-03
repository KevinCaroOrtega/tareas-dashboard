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

  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ nombre: '', descripcion: '' });

  // Cargar tareas y proyectos
  useEffect(() => {
    // Cargar tareas
    fetch('https://taula.onrender.com/api/tareas')
      .then((response) => {
        if (!response.ok) throw new Error('Error en la respuesta de tareas');
        return response.json();
      })
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error al obtener las tareas:', error))
      .finally(() => setLoading(false));

    // Cargar proyectos
    fetch('https://taula.onrender.com/api/projects')
      .then((response) => {
        if (!response.ok) throw new Error('Error en la respuesta de proyectos');
        return response.json();
      })
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error al obtener los proyectos:', error));
  }, []);

  // Manejador inputs tareas
  const handleChangeTask = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  // Agregar nueva tarea
  const handleAddTask = async () => {
    const { tarea, proyecto, responsable, fechaInicio, fechaFin } = newTask;

    if (!tarea || !proyecto || !responsable || !fechaInicio || !fechaFin) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    try {
      const response = await fetch('https://taula.onrender.com/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Error al agregar tarea');

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

  // Manejador inputs proyectos
  const handleChangeProject = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  // Agregar nuevo proyecto
  const handleAddProject = async () => {
    const { nombre, descripcion } = newProject;

    if (!nombre || !descripcion) {
      alert('Por favor, completa ambos campos del proyecto');
      return;
    }

    try {
      const response = await fetch('https://taula.onrender.com/api/proyectos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) throw new Error('Error al agregar proyecto');

      setProjects([...projects, { ...newProject, id: projects.length + 1 }]);
      setNewProject({ nombre: '', descripcion: '' });
    } catch (error) {
      console.error('Error al agregar el proyecto:', error);
    }
  };

  return (
    <div className="App">
      <h1>Dashboard de Tareas</h1>

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
        <input type="text" name="tarea" value={newTask.tarea} placeholder="Nombre de la tarea" onChange={handleChangeTask} />
        <input type="text" name="proyecto" value={newTask.proyecto} placeholder="Proyecto" onChange={handleChangeTask} />
        <input type="text" name="responsable" value={newTask.responsable} placeholder="Responsable" onChange={handleChangeTask} />
        <input type="date" name="fechaInicio" value={newTask.fechaInicio} onChange={handleChangeTask} />
        <input type="date" name="fechaFin" value={newTask.fechaFin} onChange={handleChangeTask} />
        <input type="date" name="fechaEjecucion" value={newTask.fechaEjecucion} onChange={handleChangeTask} />
        <select name="estado" value={newTask.estado} onChange={handleChangeTask}>
          <option value="Pendiente">Pendiente</option>
          <option value="En progreso">En progreso</option>
          <option value="Completada">Completada</option>
        </select>
        <button onClick={handleAddTask}>Agregar tarea</button>
      </div>

      <hr />

      <div>
        <h2>Proyectos</h2>
        <ul>
          {projects.map((p) => (
            <li key={p.id}>
              <strong>{p.nombre}</strong>: {p.descripcion}
            </li>
          ))}
        </ul>

        <h3>Agregar nuevo proyecto</h3>
        <input type="text" name="nombre" placeholder="Nombre del proyecto" value={newProject.nombre} onChange={handleChangeProject} />
        <input type="text" name="descripcion" placeholder="Descripción" value={newProject.descripcion} onChange={handleChangeProject} />
        <button onClick={handleAddProject}>Agregar proyecto</button>
      </div>
    </div>
  );
}

export default App;
