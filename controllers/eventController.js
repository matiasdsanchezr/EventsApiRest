const { matchedData } = require('express-validator');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const shareTwitter = require('share-twitter');

const Event = require('../models/Event');
const User = require('../models/User');

module.exports.getEvents = async (req, res) => {
  const start = moment().startOf('day');
  const end = moment().endOf('day');

  const events = await Event.find({ dates: { $gte: start, $lt: end } });

  const todayEvents = Object.values(events).filter((event) => !event.highlight);
  const todayHighlights = Object.values(events).filter((event) => event.highlight);

  return res.json({ todayEvents, todayHighlights });
};

module.exports.getEventsPage = async (req, res) => {
  const { page } = matchedData(req, { locations: ['params'] });

  const start = moment().startOf('day');
  const pagesCount = Math.ceil((await Event.countDocuments({ dates: { $gte: start } })) / 10);
  if (page > pagesCount) return res.status(404).json({ errors: ['page not found'] });

  const documentsToSkip = (page - 1) * 10;
  const events = await Event.find({ dates: { $gte: start } })
    .sort({ dates: 1 })
    .limit(10)
    .skip(documentsToSkip);

  return res.json({ events, pagesCount });
};

module.exports.getEventById = async (req, res) => {
  const validatedData = matchedData(req, { locations: ['params'] });

  const event = await Event.findById(validatedData.id);

  return event ? res.json({ event }) : res.status(404).json({ errors: 'event not found' });
};

module.exports.shareEvent = async (req, res) => {
  const { id } = matchedData(req, { locations: ['params'] });

  const event = await Event.findById(id);
  if (!event) return res.status(404).json({ errors: ['event not found'] });

  const url = await shareTwitter.shareTwitterURL({
    text: `Iré al ${event.title}`,
    url: 'https://www.urlDePrueba.com.ar/',
  });

  return res.json({ url });
};

module.exports.createEvent = async (req, res, next) => {
  const eventData = matchedData(req, { locations: ['body'] });

  const token = await req.get('authorization').substring(7);
  if (!token) return res.status(400).json({ errors: ['empty token'] });

  try {
    const userDataInToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const user = await User.findById(userDataInToken.id);

    if (!user) {
      return res.json({ errors: ['invalid user id'] });
    }

    eventData.user = userDataInToken.id;

    const event = new Event(eventData);
    await event.save();

    user.events = user.events.concat(event._id);
    await user.save();

    return res.json({ event });
  } catch (error) {
    return next(error);
  }
};

module.exports.putEvent = async (req, res, next) => {
  const eventData = matchedData(req, { locations: ['body'] });

  const token = await req.get('authorization').substring(7);
  if (!token) return res.status(400).json({ errors: ['empty token'] });

  try {
    const userDataInToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const user = await User.findById(userDataInToken.id);

    if (!user) {
      return res.status(400).json({ errors: ['invalid user id in token'] });
    }

    eventData.user = userDataInToken.id;

    const event = await Event.findByIdAndUpdate(eventData.id, eventData, { new: true });
    if (!event) {
      return res.status(400).json({ errors: ['invalid event id'] });
    }

    user.events = user.events.concat(event._id);
    await user.save();

    return res.json({ event });
  } catch (error) {
    return next(error);
  }
};

module.exports.deleteEventById = async (req, res, next) => {
  const { id } = matchedData(req, { locations: ['params'] });

  const token = await req.get('authorization').substring(7);
  if (!token) return res.status(400).json({ errors: ['empty token'] });

  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const event = await Event.findById(id);

    if (!event) return res.status(400).json({ errors: ['event not found'] });
    if (!event.user.equals(tokenData.id)) return res.status(401).json({ errors: ['user is not the autor'] });

    const deletedEvent = await Event.findByIdAndDelete(id);

    return deletedEvent
      ? res.json({ event })
      : res.status(400).json({ errors: ['event not found'] });
  } catch (error) {
    return next(error);
  }
};
