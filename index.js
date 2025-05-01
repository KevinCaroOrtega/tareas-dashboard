const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());

// Autenticación con Google
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

// Endpoint para verificar que el backend funciona
app.get('/api', (req, res) => {
  res.send('Servidor backend funcionando');
});

// Endpoint para obtener tareas
app.get('/api/tasks', async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Tareas!A2:G',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) return res.json([]);

    const tasks = rows.map((row, index) => ({
      id: index + 1,
      tarea: row[0] || '',
      proyecto: row[1] || '',
      responsable: row[2] || '',
      fechaInicio: row[3] || '',
      fechaFin: row[4] || '',
      fechaEjecucion: row[5] || '',
      estado: row[6] || '',
    }));

    res.json(tasks);
  } catch (err) {
    console.error('Error al leer tareas:', err);
    res.status(500).send('Error al obtener tareas');
  }
});

// Endpoint para obtener proyectos
app.get('/api/projects', async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Proyectos!A2:B',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) return res.json([]);

    const projects = rows.map((row, index) => ({
      id: index + 1,
      nombre: row[0] || '',
      descripcion: row[1] || '',
    }));

    res.json(projects);
  } catch (err) {
    console.error('Error al leer proyectos:', err);
    res.status(500).send('Error al obtener proyectos');
  }
});

// Servir el frontend React desde la carpeta build
app.use(express.static(path.join(__dirname, 'build')));

// Redirigir todo lo demás a React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Puerto
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
