const User = require('../../models/User');

exports.resetDatabase = async () => {
  await User.deleteMany({});
};

exports.validUsers = [{
  email: 'matias@gmail.com',
  password: '1Mmasd1',
  firstName: 'Matías',
  lastName: 'Sánchez',
}];

exports.missingDataUsers = [{
  email: '',
  password: '1Mmasd123',
  firstName: 'Matías',
  lastName: 'Sánchez',
}, {
  email: 'matias@gmail.com',
  password: '',
  firstName: 'Matías',
  lastName: 'Sánchez',
}, {
  email: 'matias@gmail.com',
  password: '1Mmasd123',
  firstName: '',
  lastName: 'Sánchez',
}, {
  email: 'matias@gmail.com',
  password: '1Mmasd123',
  firstName: 'Matías',
  lastName: '',
}];

exports.wrongDataUsers = [{
  email: 'usuario',
  password: '1Mmasd123',
  firstName: 'Matías',
  lastName: 'Sánchez',
}, {
  email: 'matias@gmail.com',
  password: '1Mmasd123',
  firstName: 'usuario@something',
  lastName: 'Sánchez',
}, {
  email: 'matias@gmail.com',
  password: '1Mmasd123',
  firstName: 'user',
  lastName: '7857',
}, {
  email: 'matias@gmail.com',
  password: '1Mmasd123',
  firstName: 'Matías',
  lastName: '///(/(/',
}];

exports.weakPasswordUsers = [{
  email: 'matias@gmail.com',
  password: '123456',
  firstName: 'Matías',
  lastName: 'Sánchez',
}, {
  email: 'matias@gmail.com',
  password: '1mmmmmm',
  firstName: 'Matías',
  lastName: 'Sánchez',
}, {
  email: 'matias@gmail.com',
  password: '1MMMMMM',
  firstName: 'Matías',
  lastName: 'Sánchez',
}, {
  email: 'matias@gmail.com',
  password: '1Ar',
  firstName: 'Matías',
  lastName: 'Sánchez',
}];
