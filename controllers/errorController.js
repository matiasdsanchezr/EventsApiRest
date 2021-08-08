// ================================================================
// Los errores de este modulo no deberían de ocurrir nunca, indican
// situaciones no esperadas
// ================================================================

/**
 * Registrar error si un documento ya esta almacenado en la base de datos
 * */
const alreadyRegisteredKeyHandler = (err, res) => {
  const field = Object.keys(err.keyValue);
  const code = 500;
  return res.status(code).json({
    errors: [`already registered: ${field}`],
  });
};

/**
 * Registrar error en la consola si se produce un error por un tipo de dato no valido
 * en un documento de mongoose
 */
const invalidDocumentHandler = (err, res) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const code = 500;

  if (errors.length > 1) {
    return res.status(code).json({ errors });
  }

  return res.status(code).json({ errors: [errors] });
};

/**
 * Error desconocido
 */
const genericErrorHandler = (err, res) => res.status(500).json({ errors: [err.message] });

/**
 * Función para registrar un error en la api
 * */
module.exports = function errorHandler(err, req, res, next) {
  try {
    if (err.name === 'ValidationError') {
      invalidDocumentHandler(err, res);
    } else if (err.code && err.code === 11000) {
      alreadyRegisteredKeyHandler(err, res);
    } else {
      genericErrorHandler(err, res);
    }
  } catch (e) {
    return res.status(500);
  }

  return next();
};
