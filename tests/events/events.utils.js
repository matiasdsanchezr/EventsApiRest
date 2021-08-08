const bcrypt = require('bcrypt');
const moment = require('moment');

const Event = require('../../models/Event');
const User = require('../../models/User');

const userCustomId = '610fa3573180d83b0cbed7f1';
const eventCustomId = '610fa3573180d83b0cbed7f2';

exports.resetUsersTable = async () => {
  await User.deleteMany({});
  await this.populateUserTable();
};

exports.resetEventsTable = async () => {
  await Event.deleteMany({});
  await this.populateEventsTable();
};

exports.populateUserTable = async () => {
  const userWithCustomId = new User(this.userWithCustomIdData);
  userWithCustomId.password = await bcrypt.hash(userWithCustomId.password, 10);
  await userWithCustomId.save();
};

exports.populateEventsTable = async () => {
  // Agregar un evento con id estatico
  const eventWithCustomId = new Event(this.eventWithCustomIdData);
  await eventWithCustomId.save();

  // Agregar eventos a la base de datos
  const promises = [];
  for (let i = 0; i < 20; i += 1) {
    const eventData = {
      title: `Evento ${i}`,
      description: `Descripcion del evento ${i}`,
      dates: [moment().add(i, 'days')],
      highlight: Math.random() < 0.5,
      place: `Lugar del evento ${i}`,
      imageUrl: 'www.urldelaimagen.com',
      user: userCustomId,
    };
    const event = new Event(eventData);
    promises.push(event.save());
  }
  await Promise.all(promises);
};

exports.userWithCustomIdData = {
  email: 'emailForEventsTest@gmail.com',
  password: '1Mmasd1',
  firstName: 'Pablo',
  lastName: 'Bazan',
  _id: userCustomId,
};

exports.eventWithCustomIdData = {
  title: 'Primer evento',
  description: 'Este en un evento con un id estatico',
  dates: [new Date()],
  highlight: 'false',
  place: 'something',
  imageUrl: 'www.urldelaimagen.com',
  user: userCustomId,
  _id: eventCustomId,
};

exports.validEvents = [
  {
    title: 'Evento de hoy 1',
    description: 'Este es un evento normal',
    dates: [new Date()],
    highlight: 'false',
    place: 'Lugar 1',
    imageUrl: 'www.urldelaimagen.com',
  },
  {
    title: 'Evento de hoy 2',
    description: 'Este es un evento normal',
    dates: [new Date()],
    highlight: 'false',
    place: 'Lugar 2',
    imageUrl: 'www.urldelaimagen.com',
  },
  {
    title: 'Evento destacado de hoy 1',
    description: 'Este es un evento destacado',
    dates: [new Date()],
    highlight: 'true',
    place: 'Lugar 3',
    imageUrl: 'www.urldelaimagen.com',
  },
  {
    title: 'Evento destacado de hoy 2',
    description: 'Este es un evento destacado',
    dates: [new Date()],
    highlight: 'true',
    place: 'Lugar 4',
    imageUrl: 'www.urldelaimagen.com',
  },
  {
    title: 'Evento Pasado 1',
    description: 'Este es un evento de ayer',
    dates: [moment().subtract(1, 'days')],
    highlight: 'true',
    place: 'Lugar 5',
    imageUrl: 'www.urldelaimagen.com',
  },
  {
    title: 'Evento pasado 2',
    description: 'Este es un evento de hace dos dias',
    dates: [moment().subtract(2, 'days')],
    highlight: 'false',
    place: 'Lugar 6',
    imageUrl: 'www.urldelaimagen.com',
  },
  {
    title: 'Evento Futuro 1',
    description: 'Este es un evento con fecha para dentro de un dia',
    dates: [moment().add(1, 'days')],
    highlight: 'true',
    place: 'Lugar 7',
    imageUrl: 'www.urldelaimagen.com',
  },
  {
    title: 'Evento Futuro 2',
    description: 'Este es un evento con fecha para dentro de dos dia',
    dates: [moment().add(2, 'days')],
    highlight: 'false',
    place: 'Lugar 8',
    imageUrl: 'www.urldelaimagen.com',
  },
];

exports.invalidEvents = [
  {
    title: '',
    description: 'Descripcion de un evento invalido',
    dates: ['2010/10/03'],
    highlight: 'true',
    place: 'Lugar de un evento invalido',
    imageUrl: 'www.urldelaimagen.com',
  },
  {
    title: 'El nuevo mundo',
    description: '',
    dates: ['2010/10/03'],
    highlight: 'true',
    place: 'Lugar de un evento invalido',
    imageUrl: 'www.urldelaimagen.com',
  },
  {
    title: 'El nuevo mundo',
    description: 'Descripcion de un evento invalido',
    dates: [''],
    highlight: 'true',
    place: 'Lugar de un evento invalido',
    imageUrl: 'www.urldelaimagen.com',
  },
  {
    title: 'El nuevo mundo',
    description: 'Descripcion de un evento invalido',
    dates: ['2010/10/03'],
    highlight: '',
    place: 'Lugar de un evento invalido',
    imageUrl: 'www.urldelaimagen.com',
  },
  {
    title: 'El nuevo mundo',
    description: 'Descripcion de un evento invalido',
    dates: ['2010/10/03'],
    highlight: 'true',
    place: '',
    imageUrl: 'www.urldelaimagen.com',
  },
  {
    title: 'El nuevo mundo',
    description: 'Descripcion de un evento invalido',
    dates: ['2010/10/03'],
    highlight: 'true',
    place: 'Lugar de un evento invalido',
    imageUrl: '',
  },
];
