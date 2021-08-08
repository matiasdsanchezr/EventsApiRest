const supertest = require('supertest');

const utils = require('../utils');
const userUtils = require('./users.utils');

let api;

beforeAll(async () => {
  await utils.initializeApp();
  await userUtils.resetDatabase();
  api = supertest(utils.getApp());
});

afterAll(async () => {
  await utils.closeApp();
});

describe('POST /users', () => {
  test('Registrar un nuevo usuario', async () => {
    const res = await api.post('/users').send(userUtils.validUsers[0]);
    expect(res.body.user.email).toBe(userUtils.validUsers[0].email);
  });

  test('Registrar un nuevo usuario sin pasar parámetros', async () => {
    const res = await api.post('/users').send({});
    expect(res.body.errors).not.toBe(null);
  });

  test('Registrar un nuevo usuario con un correo ya registrado', async () => {
    const res = await api.post('/users').send(userUtils.validUsers[0]).expect(400);
    expect(res.body.errors).not.toBe(null);
  });

  test('Registrar un nuevo usuario pasando un body vacío', async () => {
    const res = await api.post('/users').send({ dato: 'something' }).expect(400);
    expect(res.body.errors).not.toBe(null);
  });

  test.each(userUtils.missingDataUsers)(
    'Registrar un nuevo usuario con datos faltantes',
    async (user) => {
      const res = await api.post('/users').send(user).expect(400);
      expect(res.body.errors).not.toBe(null);
    },
  );

  test.each(userUtils.wrongDataUsers)(
    'Registrar un nuevo usuario con datos incorrectos',
    async (user) => {
      const res = await api.post('/users').send(user).expect(400);
      expect(res.body.errors).not.toBe(null);
    },
  );

  test.each(userUtils.weakPasswordUsers)(
    'Registrar un nuevo usuario usando una contraseña débil',
    async (user) => {
      const res = await api.post('/users').send(user).expect(400);
      expect(res.body.errors).not.toBe(null);
    },
  );
});

describe('POST /users/login', () => {
  test('Ingresar correctamente con un usuario registrado', async () => {
    const res = await api.post('/users/login').send(userUtils.validUsers[0]).expect(200);
    expect(res.body.user).not.toBe(null);
  });

  test('Ingresar con parámetros faltantes', async () => {
    const res = await api.post('/users/login').send({ dato: 'something' }).expect(400);
    expect(res.body.errors).not.toBe(null);
  });
});
