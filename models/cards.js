const mongoose = require('mongoose');
require('mongoose-type-url');
const ObjectDoesNotExist = require('../core/errors');
const bcrypt = require('bcryptjs');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: mongoose.Schema.Types.Url,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  versionKey: false,
});

// eslint-disable-next-line func-names
cardSchema.methods.isOwned = function (user) {
  return user._id.toString() === this.owner._id.toString();
};

module.exports = mongoose.model('card', cardSchema);
