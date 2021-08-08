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
router.post('/', validators.createEvent, eventController.createEvent);
// Modificar la informacion de un evento
router.put('/', validators.putEvent, eventController.putEvent);
// Modificar la informacion de un evento
router.delete('/:id', validators.deleteEvent, eventController.deleteEventById);

module.exports = router;
