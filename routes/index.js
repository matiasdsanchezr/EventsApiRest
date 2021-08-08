const express = require('express');

// Importar módulos de la api
const users = require('./users');
const events = require('./events');

// Implementar ruta en express
const router = express.Router();
router.use('/users', users);
router.use('/events', events);

// Ruta por defecto al ingresar en una pagina no registrada
router.use('/*', (req, res) => {
  res.status(404);
});

module.exports = router;
