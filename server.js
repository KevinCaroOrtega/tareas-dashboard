const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Autenticación con Google usando credenciales desde variable de entorno
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Endpoint para obtener tareas
app.get('/api/tareas', async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Tareas!A2:G';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    const tareas = rows.map((row, i) => ({
      id: i + 1,
      tarea: row[0] || '',
      proyecto: row[1] || '',
      responsable: row[2] || '',
      fechaInicio: row[3] || '',
      fechaFin: row[4] || '',
      fechaEjecucion: row[5] || '',
      estado: row[6] || '',
    }));

    res.json(tareas);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// Endpoint para agregar tarea
app.post('/api/tareas', async (req, res) => {
  try {
    const { tarea, proyecto, responsable, fechaInicio, fechaFin, fechaEjecucion, estado } = req.body;

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Tareas!A2:G';

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[tarea, proyecto, responsable, fechaInicio, fechaFin, fechaEjecucion, estado]],
      },
    });

    res.status(201).json({ message: 'Tarea agregada con éxito' });
  } catch (error) {
    console.error('Error al agregar la tarea:', error);
    res.status(500).json({ error: 'Error al agregar tarea' });
  }
});

// Endpoint para obtener proyectos
app.get('/api/projects', async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = 'Proyectos!A2:B';  // Ajusta el rango si tu hoja tiene un formato diferente

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    const projects = rows.map((row, i) => ({
      id: i + 1,
      nombre: row[0] || '',
      descripcion: row[1] || '',
    }));

    res.json(projects);
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    res.status(500).json({ error: 'Error al obtener los proyectos' });
  }
});

// Endpoint para agregar proyecto
app.post('/api/proyectos', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Proyectos!A2:B', // Asegúrate de que este rango sea correcto
      valueInputOption: 'RAW',
      requestBody: {
        values: [[nombre, descripcion]],
      },
    });

    res.status(201).json({ message: 'Proyecto agregado con éxito' });
  } catch (error) {
    console.error('Error al agregar el proyecto:', error);
    res.status(500).json({ error: 'Error al agregar el proyecto' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
