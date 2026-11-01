import e from "express";
import * as z from 'zod';
import { es } from "zod/locales";
import { errorHandler } from "./middlewares/error.Handler.js";
import routerApp from './routers/index.js';
import path from 'path';
import { fileURLToPath } from "url";
import cors from 'cors';

// Se configura Zod de forma global para traducir los errores a español
z.config(es());

const PORT = process.env.PORT || 5499;
const app = e();

// 1. Orígenes permitidos (dominio público de Cloudflare y pruebas locales)
const allowedOrigins = [
  'https://quantix.davidhernandez.site',
  'http://localhost:5499',
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite peticiones del mismo origen, clientes CLI/Postman (sin origin) o en la lista blanca
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado por política CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Servir la carpeta public estática (HTML, CSS, JS e imágenes)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaPublic = path.join(__dirname, '../public');

app.use(e.static(rutaPublic));

// 3. Middlewares de datos y rutas
app.use(e.json());
app.use(routerApp);

// 4. Manejador global de errores
app.use(errorHandler);

// 5. Escuchar en 0.0.0.0 para aceptar conexiones enrutadas por Cloudflare Tunnel
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in port ${PORT} -> http://localhost:${PORT}`);
});