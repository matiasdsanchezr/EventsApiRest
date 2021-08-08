const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'email is empty'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'password is empty'],
    },
    firstName: {
      type: String,
      required: [true, 'firstName is empty'],
    },
    lastName: {
      type: String,
      required: [true, 'lastName is empty'],
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
  },
  {
    collation: { locale: 'es', strength: 2 },
    timestamps: true,
  },
);

userSchema.options.toJSON = {
  transform: (doc, userJSON) => {
    const res = userJSON;
    delete res.password;
    return res;
  },
};

module.exports = model('User', userSchema);
