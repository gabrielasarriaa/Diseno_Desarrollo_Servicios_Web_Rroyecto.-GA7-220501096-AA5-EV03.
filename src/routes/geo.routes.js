/**
 * =============================================================================
 *  geo.routes.js
 * =============================================================================
 *  Endpoints del servicio de georreferenciacion.
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const geoController = require('../controllers/geo.controller');

// GET /api/geocodificar?direccion=... -> devuelve lat/lon de una direccion
router.get('/geocodificar', geoController.geocodificar);

module.exports = router;
