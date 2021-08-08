const express = require('express');
const routes = require('../routes');
const errorHandler = require('../controllers/errorController');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // Middleware
    this.bodyparser();
    this.routes();
    this.internalErrorHandler();
  }

  // Cargar bodyparser
  bodyparser() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  // Cargar rutas de la aplicación
  routes() {
    this.app.use('/', routes);
  }

  // Manejar errores no esperados
  internalErrorHandler() {
    this.app.use(errorHandler);
  }

  // Iniciar servidor en un puerto
  listen() {
    this.connection = this.app.listen(this.port, () => {
      console.log(`Servidor iniciado en el puerto ${this.port}`);
    });
  }

  // Terminar la conexión de la aplicación
  disconnect() {
    this.connection.close();
  }
}

module.exports = Server;
