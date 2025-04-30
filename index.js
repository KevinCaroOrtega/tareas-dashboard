const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const { google } = require('googleapis');

// Cargar las variables de entorno
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Definir tu ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola desde el servidor Express!');
});

// Conectar al puerto proporcionado por Render o usar 3000 por defecto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
