// Cargar base de datos
const mongoose = require('mongoose');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  ignoreUndefined: true,
};

// Iniciar conexión a la base de datos
mongoose.connect(process.env.MONGODB_URI_RELEASE, options).catch((e) => {
  console.log('Error al conectar mongoose');
  console.error(e);
});

// Eventos:
// Conexión exitosa
mongoose.connection.on('connected', () => {
  console.log('Conexión por defecto de mongoose iniciada');
});

// Error de conexión
mongoose.connection.on('error', (err) => {
  console.error(`Error al iniciar la conexión por defecto de mongoose: ${err}`);
});

// Conexión terminada
mongoose.connection.on('disconnected', () => {
  console.warn('Conexión por defecto de mongoose terminada');
});

// Aplicación finalizada
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.warn('Se cerro la conexión por defecto de mongoose debido al cierra de la aplicacion');
    process.exit(0);
  });
});

module.exports = mongoose;
