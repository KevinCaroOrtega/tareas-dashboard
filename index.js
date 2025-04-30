const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// Habilita CORS para que el frontend pueda comunicarse con este backend
app.use(cors());
app.use(express.json());

// Ruta raíz para comprobar que el servidor funciona
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando');
});

// ✅ Ruta que el frontend necesita para obtener las tareas
app.get('/api/tasks', (req, res) => {
  const tareas = [
    { id: 1, name: 'Tarea 1', description: 'Descripción de tarea 1' },
    { id: 2, name: 'Tarea 2', description: 'Descripción de tarea 2' },
    { id: 3, name: 'Tarea 3', description: 'Descripción de tarea 3' }
  ];
  res.json(tareas);
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
