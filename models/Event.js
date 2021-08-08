const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'empty title'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'empty description'],
    },
    dates: [
      {
        type: Date,
        required: [true, 'empty dates'],
      },
    ],
    place: {
      type: String,
      required: [true, 'empty place'],
    },
    highlight: {
      type: Boolean,
      required: [true, 'empty highlight'],
    },
    imageUrl: {
      type: String,
      required: [true, 'empty imageUrl'],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'empty user id'],
      ref: 'User',
    },
  },
  {
    collation: { locale: 'es', strength: 2 },
    timestamps: true,
  },
);

module.exports = model('Event', eventSchema);
