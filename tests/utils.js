const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config({ path: '.env' });

const Server = require('../models/Server');

// Instanciar un servidor express
const server = new Server();

// Parámetros de mongoose
const mongooseUri = process.env.MONGODB_URI_DEVELOPMENT;
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  ignoreUndefined: true,
};

/** Inicializar mongoose y express */
exports.initializeApp = async () => {
  server.listen();
  await mongoose
    .connect(mongooseUri, mongooseOptions)
    .catch((e) => {
      console.log('Error al conectar mongoose');
      console.error(e);
    });
};

/** @returns Instancia de express */
exports.getApp = () => server.app;

/** Finalizar express y la conexión a la base de datos */
exports.closeApp = async () => {
  server.disconnect();
  await mongoose.connection.close();
};
