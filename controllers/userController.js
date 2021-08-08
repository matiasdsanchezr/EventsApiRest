const bcrypt = require('bcrypt');
const { matchedData } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

module.exports.createUser = async (req, res, next) => {
  const validatedData = matchedData(req, { locations: ['body'] });

  validatedData.password = await bcrypt.hash(validatedData.password, 10);

  User.create(validatedData, (error, user) => {
    if (error) return next(error);
    return res.json({ user });
  });
};

module.exports.loginUser = async (req, res, next) => {
  const validatedData = matchedData(req, { locations: ['body'] });
  const { email, password } = validatedData;

  await User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        res.status(401).json({ errors: ['invalid user credentials'] });
      }

      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).json({ errors: ['invalid user credentials'] });
      }

      const dataForToken = {
        id: user._id,
        email: user.email,
      };

      const token = jwt.sign(dataForToken, process.env.JWT_SECRET_TOKEN, { expiresIn: '1 days' });

      return res.send({ user: user.toJSON(), token });
    })
    .catch((error) => {
      next(error);
    });
};
