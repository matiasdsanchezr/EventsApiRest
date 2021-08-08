const {
  body, param, header, validationResult,
} = require('express-validator');
const jwt = require('jsonwebtoken');

/**
 * Validar los campos y devolver los errores en un json en caso de que una verificación
 * haya fallado
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorsMsgArr = errors.array().map((e) => e.msg);
  return res.status(400).json({ errors: errorsMsgArr });
};

// ================================================
// Validaciones para el modulo events
// ================================================
module.exports.getEventsPage = [
  header('authorization')
    .notEmpty()
    .withMessage('missing token')
    .bail()
    .custom(async (value) => {
      const token = value.substring(7);
      jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err) => {
        if (err) throw new Error('invalid token');
        return true;
      });
    }),
  param('page').isInt({ min: 1 }).withMessage('invalid page'),
  validate,
];

module.exports.getEventById = [param('id').isMongoId().withMessage('invalid id'), validate];

module.exports.deleteEvent = [
  param('id').isMongoId().withMessage('invalid id'),
  header('authorization')
    .notEmpty()
    .withMessage('missing token')
    .bail()
    .custom(async (value) => {
      const token = value.substring(7);
      jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err) => {
        if (err) throw new Error('invalid token');
        return true;
      });
    }),
  validate,
];

module.exports.createEvent = [
  header('authorization')
    .notEmpty()
    .withMessage('missing token')
    .bail()
    .custom(async (value) => {
      const token = value.substring(7);
      jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err) => {
        if (err) throw new Error('invalid token');
        return true;
      });
    }),
  body('title').trim().notEmpty().withMessage('missing title'),
  body('description').trim().notEmpty().withMessage('missing description'),
  body('dates').isArray({ min: 1 }).withMessage('missing dates'),
  body('dates.*').isISO8601({ strictMode: true }).withMessage('invalid dates'),
  body('place').trim().notEmpty().withMessage('missing place'),
  body('highlight').isBoolean().withMessage('missing highlight'),
  body('imageUrl')
    .trim()
    .notEmpty()
    .withMessage('missing imageUrl')
    .bail()
    .isURL()
    .withMessage('invalid url'),
  validate,
];

module.exports.putEvent = [
  body('id').isMongoId().withMessage('invalid event id'),
  validate,
  this.createEvent,
];
