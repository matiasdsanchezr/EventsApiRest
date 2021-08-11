const express = require('express');

const userController = require('../../controllers/userController');
const validators = require('./usersValidators');

const router = express.Router();

// Registrar un nuevo usuario en la base de datos
router.post('/', validators.postUser, userController.createUser);

// Ingresar como un usuario registrado
router.post('/login', validators.postUserLogin, userController.loginUser);

module.exports = router;
