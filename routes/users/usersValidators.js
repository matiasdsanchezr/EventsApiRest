const { body, validationResult } = require('express-validator');
const User = require('../../models/User');

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

module.exports.checkUserPost = [
  body('email')
    .isLength({ max: 30 })
    .isEmail()
    .normalizeEmail()
    .withMessage('invalid email')
    .bail()
    .custom(async (value) => {
      await User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(new Error('already used email'));
        }
        return true;
      });
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('empty password')
    .bail()
    .isStrongPassword({ minSymbols: 0, minLength: 6 })
    .withMessage('weak password')
    .bail(),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('empty firstName')
    .bail()
    .isAlpha('es-ES')
    .withMessage('invalid firstName')
    .bail()
    .toLowerCase(),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('empty lastName')
    .bail()
    .isAlpha('es-ES')
    .withMessage('invalid lastName')
    .bail()
    .toLowerCase(),
  validate,
];

module.exports.checkUserLogin = [
  body('email').isLength({ max: 30 }).isEmail().normalizeEmail()
    .withMessage('invalid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('empty password')
    .bail()
    .isStrongPassword({ minSymbols: 0, minLength: 6 })
    .withMessage('weak password'),
  validate,
];
