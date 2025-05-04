import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Estados para manejar los datos
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    tarea: '',
    proyecto: '',
    responsable: '',
    fechaInicio: '',
    fechaFin: '',
    estado: 'Pendiente'
  });
  const [newProject, setNewProject] = useState({
    nombre: '',
    descripcion: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          fetch('https://taula.onrender.com/api/tareas'),
          fetch('https://taula.onrender.com/api/projects')
        ]);
        
        const tasksData = await tasksRes.json();
        const projectsData = await projectsRes.json();
        
        setTasks(tasksData);
        setProjects(projectsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejar cambios en los formularios
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  // Agregar nueva tarea
  const handleAddTask = async () => {
    if (!newTask.tarea || !newTask.proyecto) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    try {
      const res = await fetch('https://taula.onrender.com/api/tareas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      const addedTask = await res.json();
      setTasks([...tasks, addedTask]);
      setNewTask({
        tarea: '',
        proyecto: '',
        responsable: '',
        fechaInicio: '',
        fechaFin: '',
        estado: 'Pendiente'
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Agregar nuevo proyecto
  const handleAddProject = async () => {
    if (!newProject.nombre) {
      alert('Por favor ingresa un nombre para el proyecto');
      return;
    }

    try {
      const res = await fetch('https://taula.onrender.com/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      const addedProject = await res.json();
      setProjects([...projects, addedProject]);
      setNewProject({ nombre: '', descripcion: '' });
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  // Filtrar tareas por estado
  const filteredTasks = (status) => {
    return tasks.filter(task => task.estado === status);
  };

  // Calcular estadísticas
  const totalTasks = tasks.length;
  const completedTasks = filteredTasks('Completada').length;
  const pendingTasks = filteredTasks('Pendiente').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header del Dashboard */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Bienvenido de nuevo. Aquí está el resumen de tus tareas.</p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Tarjeta Tareas Totales */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Tareas totales</p>
              <p className="text-2xl font-bold mt-1">{totalTasks}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tarjeta Tareas Completadas */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Tareas completadas</p>
              <p className="text-2xl font-bold mt-1">{completedTasks}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tarjeta Tareas Pendientes */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Tareas pendientes</p>
              <p className="text-2xl font-bold mt-1">{pendingTasks}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tarjeta Progreso General */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Progreso general</p>
              <p className="text-2xl font-bold mt-1">{progress}%</p>
            </div>
            <div className="relative w-12 h-12">
              <svg className="progress-ring" width="48" height="48">
                <circle
                  className="text-gray-200"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="20"
                  cx="24"
                  cy="24"
                />
                <circle
                  className="text-blue-500"
                  strokeWidth="4"
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 - (125.6 * progress) / 100}
                  stroke="currentColor"
                  fill="transparent"
                  r="20"
                  cx="24"
                  cy="24"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tablero de Tareas */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Tablero de tareas</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Columna Pendiente */}
          <div className="p-4 border-r">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Pendiente</h3>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {filteredTasks('Pendiente').length}
              </span>
            </div>
            
            {filteredTasks('Pendiente').map(task => (
              <div key={task.id} className="mb-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {task.proyecto}
                  </span>
                </div>
                <h4 className="mt-2 font-medium">{task.tarea}</h4>
                <p className="text-sm text-gray-600 mt-1">{task.descripcion || 'Sin descripción'}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {task.fechaInicio && `Inicio: ${new Date(task.fechaInicio).toLocaleDateString()}`}
                </div>
              </div>
            ))}
          </div>

          {/* Columna En Progreso */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">En progreso</h3>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {filteredTasks('En progreso').length}
              </span>
            </div>
            
            {filteredTasks('En progreso').map(task => (
              <div key={task.id} className="mb-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {task.proyecto}
                  </span>
                </div>
                <h4 className="mt-2 font-medium">{task.tarea}</h4>
                <p className="text-sm text-gray-600 mt-1">{task.descripcion || 'Sin descripción'}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {task.fechaInicio && `Inicio: ${new Date(task.fechaInicio).toLocaleDateString()}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección de Proyectos */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Proyectos</h2>
        </div>
        
        <div className="p-4">
          {projects.map(project => (
            <div key={project.id} className="mb-3 p-3 border rounded-lg">
              <h3 className="font-medium">{project.nombre}</h3>
              <p className="text-sm text-gray-600">{project.descripcion || 'Sin descripción'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario para agregar nueva tarea */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Agregar nueva tarea</h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarea*</label>
              <input
                type="text"
                name="tarea"
                value={newTask.tarea}
                onChange={handleTaskChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto*</label>
              <input
                type="text"
                name="proyecto"
                value={newTask.proyecto}
                onChange={handleTaskChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={newTask.descripcion}
              onChange={handleTaskChange}
              className="w-full p-2 border rounded"
              rows="2"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
              <input
                type="date"
                name="fechaInicio"
                value={newTask.fechaInicio}
                onChange={handleTaskChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
              <input
                type="date"
                name="fechaFin"
                value={newTask.fechaFin}
                onChange={handleTaskChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Agregar tarea
          </button>
        </div>
      </div>

      {/* Formulario para agregar nuevo proyecto */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Agregar nuevo proyecto</h2>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del proyecto*</label>
            <input
              type="text"
              name="nombre"
              value={newProject.nombre}
              onChange={handleProjectChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={newProject.descripcion}
              onChange={handleProjectChange}
              className="w-full p-2 border rounded"
              rows="2"
            />
          </div>
          
          <button
            onClick={handleAddProject}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Agregar proyecto
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;