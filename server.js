const express = require('express');
const path = require('path');
const { google } = require('googleapis');
const credentials = require('./tareas-dashboard-credentials.json');
const cors = require('cors');

// Crear la aplicación Express
const app = express();
const port = 3000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para poder recibir datos en formato JSON (POST)
app.use(express.json());

// Servir archivos estáticos desde la carpeta frontend/public
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Configurar la autenticación con Google Sheets
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

// ID de la hoja de cálculo de Google
const SPREADSHEET_ID = '1fiNGPPI7DYcKgFHJnZDT0nk1oilkQUe2BZB1cWHELro';

// Ruta para obtener las tareas desde Google Sheets
app.get('/api/tareas', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Tareas!A:G', // Rango de datos en la hoja de tareas
    });

    const tareas = response.data.values;
    const headers = tareas.shift(); // Remover las cabeceras

    // Estructurar los datos
    const tareasList = tareas.map((tarea) => ({
      tarea: tarea[0],
      proyecto: tarea[1],
      responsable: tarea[2],
      fechaInicio: tarea[3],
      fechaFin: tarea[4],
      fechaEjecucion: tarea[5],
      estado: tarea[6],
    }));

    res.json(tareasList);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// Ruta para agregar una nueva tarea a Google Sheets
app.post('/api/add-task', async (req, res) => {
  const { tarea, proyecto, responsable, fechaInicio, fechaFin, fechaEjecucion, estado } = req.body;

  try {
    const newTask = [
      '', // La columna ID la manejaremos como un autoincremento en la base de datos
      tarea,
      proyecto,
      responsable,
      fechaInicio,
      fechaFin,
      fechaEjecucion,
      estado
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Tareas!A1',  // Añadir la nueva tarea en la hoja "Tareas"
      valueInputOption: 'RAW',
      resource: {
        values: [newTask],
      },
    });

    res.json({
      id: newTask[0],  // Deberás gestionar el ID de alguna forma
      tarea: newTask[1],
      proyecto: newTask[2],
      responsable: newTask[3],
      fechaInicio: newTask[4],
      fechaFin: newTask[5],
      fechaEjecucion: newTask[6],
      estado: newTask[7],
    });
  } catch (error) {
    console.error('Error al agregar la tarea:', error);
    res.status(500).json({ error: 'Error al agregar la tarea' });
  }
});

// Servir el archivo HTML principal (index.html) cuando se accede a la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
