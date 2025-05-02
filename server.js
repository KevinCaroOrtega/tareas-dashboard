const express = require('express');
const path = require('path');
const { google } = require('googleapis');
const credentials = require('./tareas-dashboard-credentials.json');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del build de React
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Configuración de autenticación con Google Sheets
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '1fiNGPPI7DYcKgFHJnZDT0nk1oilkQUe2BZB1cWHELro';

// GET tareas
app.get('/api/tareas', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Tareas!A:G',
    });

    const tareas = response.data.values;
    const headers = tareas.shift();

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

// POST tarea nueva
app.post('/api/tareas', async (req, res) => {
  try {
    const { tarea, proyecto, responsable, fechaInicio, fechaFin, fechaEjecucion, estado } = req.body;

    const request = {
      spreadsheetId: SPREADSHEET_ID,
      range: 'Tareas!A:G',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[tarea, proyecto, responsable, fechaInicio, fechaFin, fechaEjecucion || '', estado || 'Pendiente']],
      },
    };

    const response = await sheets.spreadsheets.values.append(request);
    res.status(201).json({
      message: 'Tarea agregada con éxito',
      tarea: { tarea, proyecto, responsable, fechaInicio, fechaFin, fechaEjecucion, estado },
    });
  } catch (error) {
    console.error('Error al agregar tarea:', error);
    res.status(500).json({ error: 'Error al agregar tarea' });
  }
});

// Fallback para React (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
