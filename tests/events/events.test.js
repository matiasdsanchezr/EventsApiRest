const supertest = require('supertest');

const utils = require('../utils');
const eventsUtils = require('./events.utils');

let api;
let token;

beforeAll(async () => {
  await utils.initializeApp();
  await eventsUtils.resetUsersTable();
  await eventsUtils.resetEventsTable();

  api = supertest(utils.getApp());

  const user = eventsUtils.userWithCustomIdData;
  const res = await api
    .post('/users/login')
    .send({ email: user.email, password: user.password })
    .expect(200);
  token = res.body.token;
});

afterAll(async () => {
  await utils.closeApp();
});

describe('POST /events', () => {
  const { validEvents } = eventsUtils;
  test.each(validEvents)('Registrar correctamente un evento nuevo', async (validEvent) => {
    const res = await api
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send(validEvent)
      .expect(200);
    expect(res.body.event).not.toBe(null);
  });

  test('Registrar un evento con un token invalido', async () => {
    const res = await api
      .post('/events')
      .set('Authorization', 'asd')
      .send(eventsUtils.validEvents[0])
      .expect(400);
    expect(res.body.errors).not.toBe(null);
  });

  const { invalidEvents } = eventsUtils;
  test.each(invalidEvents)('Registrar un evento con datos faltantes', async (invalidEvent) => {
    const res = await api
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidEvent)
      .expect(400);
    expect(res.body.errors).not.toBe(null);
  });
});

describe('GET /events', () => {
  test('Obtener eventos y destacados del dia actual', async () => {
    const res = await api.get('/events').expect(200);
    expect(res.body.todayEvents).not.toBe(null);
  });
});

describe('GET /events/:id', () => {
  const event = eventsUtils.eventWithCustomIdData;

  test('Obtener un evento usando un id mongo valido', async () => {
    const res = await api.get(`/events/${event._id}`).expect(200);
    expect(res.body.event).not.toBe(null);
  });

  test('Obtener un evento usando un id mongo valido no registrado', async () => {
    const res = await api.get('/events/610fa3573180dfffffffffff').expect(404);
    expect(res.body.errors).not.toBe(null);
  });

  test('Obtener un evento usando un id mongo invalido', async () => {
    const res = await api.get('/events/15623').expect(400);
    expect(res.body.errors).not.toBe(null);
  });
});

describe('GET /events/page/:page', () => {
  let lastPage = 0;

  test('Obtener un arreglo con eventos proximos en la primera pagina', async () => {
    const res = await api.get('/events/page/1').set('Authorization', `Bearer ${token}`).expect(200);
    expect(res.body.events).not.toBe(null);
    expect(res.body.events.length).toBe(10);
    lastPage = res.body.pagesCount;
  });

  test('Obtener un arreglo con los eventos proximos de la ultima pagina', async () => {
    const res = await api
      .get(`/events/page/${lastPage}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.events).not.toBe(null);
  });

  test('Obtener un arreglo de eventos proximos pasando un numero de pagina invalido', async () => {
    const res = await api
      .get(`/events/page/${lastPage + 1}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
    expect(res.body.errors).not.toBe(null);
  });

  test('Obtener un arreglo de eventos proximos usando un token invalido', async () => {
    const res = await api.get('/events/page/1').set('Authorization', 'asd').expect(400);
    expect(res.body.errors).not.toBe(null);
  });
});

describe('PUT /events', () => {
  test('Modificar datos de un evento', async () => {
    const newEventData = { ...eventsUtils.eventWithCustomIdData };
    newEventData.title = 'Nuevo titulo';
    newEventData.id = newEventData._id;

    const res = await api
      .put('/events')
      .set('Authorization', `Bearer ${token}`)
      .send(newEventData)
      .expect(200);
    expect(res.body.event.title).toBe('Nuevo titulo');
  });

  test('Modificar datos de un evento con id invalido', async () => {
    const newEventData = { ...eventsUtils.eventWithCustomIdData };
    newEventData.title = 'Nuevo titulo';
    newEventData.id = 'asdasd';

    const res = await api
      .put('/events')
      .set('Authorization', `Bearer ${token}`)
      .send(newEventData)
      .expect(400);
    expect(res.body.errors).not.toBe(null);
  });

  test('Modificar datos de un evento con id valido sin pasar datos', async () => {
    const newEventData = {};
    newEventData.id = eventsUtils.eventWithCustomIdData._id;

    const res = await api
      .put('/events')
      .set('Authorization', `Bearer ${token}`)
      .send(newEventData)
      .expect(400);
    expect(res.body.errors).not.toBe(null);
  });
});

describe('DELETE /events/:id', () => {
  test('Eliminar un evento', async () => {
    const eventToDelete = {};
    eventToDelete.id = eventsUtils.eventWithCustomIdData._id;

    const res = await api
      .delete(`/events/${eventToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.event).not.toBe(null);
  });

  test('Eliminar un evento con id invalido', async () => {
    const res = await api
      .delete('/events/asdasd123')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    expect(res.body.errors).not.toBe(null);
  });
});

describe('GET /events/share/:id', () => {
  beforeAll(async () => {
    await eventsUtils.resetEventsTable();
  });

  test('Generar un enlace para compartir un evento en twitter', async () => {
    const id = eventsUtils.eventWithCustomIdData._id;
    const res = await api
      .get(`/events/share/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.url).not.toBe(null);
  });

  test('Generar un enlace para compartir un evento en twitter usando un id invalido', async () => {
    const res = await api
      .get('/events/share/asdasd123')
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
    expect(res.body.errors).not.toBe(null);
  });
});
