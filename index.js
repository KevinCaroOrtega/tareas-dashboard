const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());

// Endpoint de prueba
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando');
});

// Endpoint de tareas
app.get('/api/tasks', (req, res) => {
  res.json([
    { id: 1, name: 'Tarea 1', description: 'Descripción de tarea 1' },
    { id: 2, name: 'Tarea 2', description: 'Descripción de tarea 2' },
    { id: 3, name: 'Tarea 3', description: 'Descripción de tarea 3' }
  ]);
});

// Puerto asignado por Render
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

