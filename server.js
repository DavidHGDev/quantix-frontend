const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5499;

// 1. Configurar CORS
// Permite peticiones desde tu dominio público y localhost
const allowedOrigins = [
  'https://quantix.davidhernandez.site',
  'http://localhost:5499'
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite peticiones sin origen (como curl o apps móviles) o si está en la lista blanca
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// 2. Servir los archivos estáticos de tu frontend (HTML, CSS, JS)
// Suponiendo que tus archivos están en la carpeta actual o en 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 3. Rutas de API de prueba
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: 'Conexión exitosa desde Debian por Cloudflare Tunnel' });
});

// 4. Escuchar en 0.0.0.0 en el puerto 5499
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Express listo en http://localhost:${PORT}`);
});