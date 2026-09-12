/**
 * =============================================================================
 *  server.js — Proyecto integrado CoVigilant (front-end + servicio de autenticacion)
 * =============================================================================
 *  Combina en un solo servidor:
 *    - El sitio web CoVigilant (Evidencia GA7-220501096-AA4-EV03), servido
 *      como archivos estaticos desde la carpeta /public.
 *    - El servicio web de registro/login (Evidencia GA7-220501096-AA5-EV01),
 *      expuesto bajo el prefijo /api.
 * =============================================================================
 */

const express = require('express');
const path = require('path');
const authRoutes = require('./src/routes/auth.routes');

const app = express();
const PUERTO = process.env.PORT || 3000;

// Middleware para interpretar el body de las peticiones como JSON
app.use(express.json());

// Sirve el front-end (index.html, style.css, script.js, img/) como sitio estatico.
// Al entrar a http://localhost:3000 se carga automaticamente public/index.html.
app.use(express.static(path.join(__dirname, 'public')));

// Endpoints del servicio de autenticacion: /api/registro y /api/login
app.use('/api', authRoutes);

// Manejador de rutas de API no encontradas (404)
app.use('/api', (req, res) => {
  res.status(404).json({ exito: false, mensaje: 'Recurso no encontrado.' });
});

// Manejador global de errores no controlados
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
});

app.listen(PUERTO, () => {
  console.log(`CoVigilant escuchando en http://localhost:${PUERTO}`);
  console.log(`  - Sitio web:        http://localhost:${PUERTO}`);
  console.log(`  - API autenticacion: http://localhost:${PUERTO}/api/login`);
});
