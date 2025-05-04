import React, { useState, useEffect } from 'react';
import './App.css';
import Sortable from 'sortablejs';

function App() {
  // Estados de UI
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Estados de datos
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

  // Efecto para el modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Efecto para cargar datos
  useEffect(() => {
    const loadData = async () => {
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
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Efecto para SortableJS
  useEffect(() => {
    if (tasks.length > 0) {
      const columns = document.querySelectorAll('.task-column');
      columns.forEach(column => {
        new Sortable(column, {
          group: 'tasks',
          animation: 150,
          onEnd: (evt) => {
            const taskId = evt.item.dataset.id;
            const newStatus = evt.to.dataset.status;
            
            // Actualizar estado local
            setTasks(prevTasks => 
              prevTasks.map(task => 
                task.id === taskId ? { ...task, estado: newStatus } : task
              )
            );
            
            // Actualizar en backend
            updateTaskStatus(taskId, newStatus);
          }
        });
      });
    }
  }, [tasks]);

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await fetch(`https://taula.onrender.com/api/tareas/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newStatus })
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Manejadores de eventos
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleAddTask = async () => {
    try {
      const res = await fetch('https://taula.onrender.com/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
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
      console.error("Error adding task:", error);
    }
  };

  const handleAddProject = async () => {
    try {
      const res = await fetch('https://taula.onrender.com/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      
      const addedProject = await res.json();
      setProjects([...projects, addedProject]);
      setNewProject({ nombre: '', descripcion: '' });
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  // Filtros y cálculos
  const filteredTasks = (status) => tasks.filter(task => task.estado === status);
  
  const stats = {
    total: tasks.length,
    completed: filteredTasks('Completada').length,
    pending: filteredTasks('Pendiente').length,
    progress: tasks.length > 0 ? Math.round((filteredTasks('Completada').length / tasks.length) * 100) : 0
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Cargando datos...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 dark:bg-gray-800 dark:border-gray-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo y menú móvil */}
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="mr-2 p-2 rounded-md text-gray-600 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h1 className="ml-2 text-xl font-bold text-gray-800 dark:text-white">TaskFlow</h1>
            </div>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="flex-1 mx-4 hidden md:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar tareas..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <kbd className="absolute right-3 top-2.5 px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded dark:bg-gray-600 dark:text-gray-200">⌘ K</kbd>
            </div>
          </div>
          
          {/* Controles de usuario */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setCommandPaletteOpen(!commandPaletteOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <button 
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden md:flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Nueva tarea
            </button>
            
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 relative dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="notification-badge">3</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden dark:bg-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">Carlos</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="hidden md:inline h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <div className="py-1">
                    <button 
                      onClick={() => setDarkMode(!darkMode)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {darkMode ? 'Modo claro' : 'Modo oscuro'}
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Cerrar sesión</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      {commandPaletteOpen && (
        <div className="fixed inset-x-0 top-16 z-40 bg-white shadow-md border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="container mx-auto p-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar o crear tarea rápida..." 
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <div className="absolute right-3 top-3.5 flex items-center space-x-2">
                <kbd className="px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded dark:bg-gray-600 dark:text-gray-200">Esc</kbd>
                <span className="text-xs text-gray-500 dark:text-gray-400">para cerrar</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block flex-shrink-0 overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4">
            <nav className="space-y-1">
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Mis tareas
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendario
              </a>
            </nav>
            
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Proyectos
              </h3>
              <div className="mt-2 space-y-1">
                {projects.map(project => (
                  <a key={project.id} href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    {project.nombre}
                  </a>
                ))}
              </div>
              <button 
                onClick={() => setCommandPaletteOpen(true)}
                className="mt-2 flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100 rounded-md w-full dark:text-blue-400 dark:hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Añadir proyecto
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-gray-800">
              <div className="h-full flex flex-col overflow-y-auto">
                <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h1 className="ml-2 text-xl font-bold text-gray-800 dark:text-white">TaskFlow</h1>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <nav className="space-y-1">
                    <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-600 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </a>
                    <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Mis tareas
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 dark:bg-gray-900">
          {/* Dashboard Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 mt-1 dark:text-gray-300">Bienvenido de nuevo, Carlos. Aquí está el resumen de tus tareas.</p>
          </div>

          {/* Stats Cards - Versión exacta al diseño */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Tarjeta Tareas Totales */}
            <div className="bg-white rounded-lg shadow p-5 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium dark:text-gray-400">Tareas totales</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1 dark:text-white">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full dark:bg-blue-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium flex items-center dark:text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  8%
                </span>
                <span className="text-gray-500 text-sm ml-2 dark:text-gray-400">vs semana anterior</span>
              </div>
            </div>

            {/* Tarjeta Tareas Completadas */}
            <div className="bg-white rounded-lg shadow p-5 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium dark:text-gray-400">Tareas completadas</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1 dark:text-white">{stats.completed}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full dark:bg-green-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium flex items-center dark:text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {stats.progress}%
                </span>
                <span className="text-gray-500 text-sm ml-2 dark:text-gray-400">de completadas</span>
              </div>
            </div>

            {/* Tarjeta Tareas Pendientes */}
            <div className="bg-white rounded-lg shadow p-5 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium dark:text-gray-400">Tareas pendientes</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1 dark:text-white">{stats.pending}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full dark:bg-yellow-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-14 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-red-500 text-sm font-medium flex items-center dark:text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  5%
                </span>
                <span className="text-gray-500 text-sm ml-2 dark:text-gray-400">vs semana anterior</span>
              </div>
            </div>

            {/* Tarjeta Tareas en Progreso */}
            <div className="bg-white rounded-lg shadow p-5 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium dark:text-gray-400">Tareas en progreso</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1 dark:text-white">{filteredTasks('En progreso').length}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full dark:bg-purple-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium flex items-center dark:text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  3%
                </span>
                <span className="text-gray-500 text-sm ml-2 dark:text-gray-400">vs semana anterior</span>
              </div>
            </div>
          </div>

          {/* Task Board - Versión exacta al diseño */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 dark:text-white">Tablero de tareas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Columna Pendiente */}
              <div className="bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg dark:bg-gray-700 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Pendiente</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200">
                      {filteredTasks('Pendiente').length}
                    </span>
                  </div>
                </div>
                <div className="p-4 task-column" data-status="Pendiente">
                  {filteredTasks('Pendiente').map(task => (
                    <div key={task.id} data-id={task.id} className="task-card mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded dark:bg-green-900 dark:text-green-200">
                          {task.proyecto}
                        </span>
                        <div className="flex space-x-1">
                          <button className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 mt-2 dark:text-white">{task.tarea}</h4>
                      <p className="text-gray-600 text-sm mt-1 dark:text-gray-300">{task.descripcion || 'Sin descripción'}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-2 border-white dark:bg-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-500 ml-2 dark:text-gray-400">{task.responsable || 'Tú'}</span>
                        </div>
                        {task.fechaFin && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(task.fechaFin).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna En Progreso */}
              <div className="bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg dark:bg-blue-900/20 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">En progreso</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                      {filteredTasks('En progreso').length}
                    </span>
                  </div>
                </div>
                <div className="p-4 task-column" data-status="En progreso">
                  {filteredTasks('En progreso').map(task => (
                    <div key={task.id} data-id={task.id} className="task-card mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded dark:bg-blue-900 dark:text-blue-200">
                          {task.proyecto}
                        </span>
                        <div className="flex space-x-1">
                          <button className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 mt-2 dark:text-white">{task.tarea}</h4>
                      <p className="text-gray-600 text-sm mt-1 dark:text-gray-300">{task.descripcion || 'Sin descripción'}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-2 border-white dark:bg-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-500 ml-2 dark:text-gray-400">{task.responsable || 'Tú'}</span>
                        </div>
                        {task.fechaFin && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(task.fechaFin).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna Revisión */}
              <div className="bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="p-4 border-b border-gray-200 bg-yellow-50 rounded-t-lg dark:bg-yellow-900/20 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Revisión</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                      {filteredTasks('Revisión').length}
                    </span>
                  </div>
                </div>
                <div className="p-4 task-column" data-status="Revisión">
                  {filteredTasks('Revisión').map(task => (
                    <div key={task.id} data-id={task.id} className="task-card mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded dark:bg-yellow-900 dark:text-yellow-200">
                          {task.proyecto}
                        </span>
                        <div className="flex space-x-1">
                          <button className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 mt-2 dark:text-white">{task.tarea}</h4>
                      <p className="text-gray-600 text-sm mt-1 dark:text-gray-300">{task.descripcion || 'Sin descripción'}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-2 border-white dark:bg-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-500 ml-2 dark:text-gray-400">{task.responsable || 'Tú'}</span>
                        </div>
                        {task.fechaFin && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(task.fechaFin).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Columna Completada */}
              <div className="bg-white rounded-lg shadow dark:bg-gray-800">
                <div className="p-4 border-b border-gray-200 bg-green-50 rounded-t-lg dark:bg-green-900/20 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Completada</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                      {filteredTasks('Completada').length}
                    </span>
                  </div>
                </div>
                <div className="p-4 task-column" data-status="Completada">
                  {filteredTasks('Completada').map(task => (
                    <div key={task.id} data-id={task.id} className="task-card mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded dark:bg-green-900 dark:text-green-200">
                          {task.proyecto}
                        </span>
                        <div className="flex space-x-1">
                          <button className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 mt-2 dark:text-white">{task.tarea}</h4>
                      <p className="text-gray-600 text-sm mt-1 dark:text-gray-300">{task.descripcion || 'Sin descripción'}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden border-2 border-white dark:bg-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-500 ml-2 dark:text-gray-400">{task.responsable || 'Tú'}</span>
                        </div>
                        {task.fechaFin && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(task.fechaFin).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Forms Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Task Form */}
            <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-800 mb-4 dark:text-white">Agregar nueva tarea</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="tarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la tarea</label>
                  <input
                    type="text"
                    id="tarea"
                    name="tarea"
                    value={newTask.tarea}
                    onChange={handleTaskChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Nombre de la tarea"
                  />
                </div>
                
                <div>
                  <label htmlFor="proyecto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proyecto</label>
                  <input
                    type="text"
                    id="proyecto"
                    name="proyecto"
                    value={newTask.proyecto}
                    onChange={handleTaskChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Proyecto"
                  />
                </div>
                
                <div>
                  <label htmlFor="responsable" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Responsable</label>
                  <input
                    type="text"
                    id="responsable"
                    name="responsable"
                    value={newTask.responsable}
                    onChange={handleTaskChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Responsable"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha inicio</label>
                    <input
                      type="date"
                      id="fechaInicio"
                      name="fechaInicio"
                      value={newTask.fechaInicio}
                      onChange={handleTaskChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha fin</label>
                    <input
                      type="date"
                      id="fechaFin"
                      name="fechaFin"
                      value={newTask.fechaFin}
                      onChange={handleTaskChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={newTask.estado}
                    onChange={handleTaskChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Revisión">Revisión</option>
                    <option value="Completada">Completada</option>
                  </select>
                </div>
                
                <button
                  onClick={handleAddTask}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Agregar tarea
                </button>
              </div>
            </div>

            {/* Add Project Form */}
            <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-800 mb-4 dark:text-white">Agregar nuevo proyecto</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del proyecto</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={newProject.nombre}
                    onChange={handleProjectChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Nombre del proyecto"
                  />
                </div>
                
                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={newProject.descripcion}
                    onChange={handleProjectChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Descripción del proyecto"
                  ></textarea>
                </div>
                
                <button
                  onClick={handleAddProject}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Agregar proyecto
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;