const express = require('express');

const eventController = require('../../controllers/eventController');
const validators = require('./eventsValidators');

const router = express.Router();

// Obtener eventos y destacados del dia actual
router.get('/', eventController.getEvents);

// Obtener paginados ordenados por fechas
router.get('/page/:page', validators.getEventsPage, eventController.getEventsPage);

// Obtener detalles de un evento
router.get('/:id', validators.getEventById, eventController.getEventById);

// Obtener enlace para compartir en twitter
router.get('/share/:id', validators.getEventById, eventController.shareEvent);

// Registrar un nuevo evento
router.post('/', validators.postEvent, eventController.createEvent);

// Modificar la información de un evento
router.put('/', validators.putEvent, eventController.putEvent);

// Eliminar un evento
router.delete('/:id', validators.deleteEventById, eventController.deleteEventById);

module.exports = router;
