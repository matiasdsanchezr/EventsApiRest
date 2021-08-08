const express = require('express');

const userController = require('../../controllers/userController');
const validators = require('./usersValidators');

const router = express.Router();

// Registrar un nuevo usuario en la base de datos
router.post('/', validators.checkUserPost, userController.createUser);

// Actualizar la información de un vehiculo usando el id
router.post('/login', validators.checkUserLogin, userController.loginUser);

module.exports = router;
