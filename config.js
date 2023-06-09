require('dotenv').config();

module.exports = {
  TOKEN_EXPIRATION: '7d',
  SECRET_KEY: process.env.SECRET_KEY || 'SOMETHING-REALLY-SECRET',
  MONGO_DNS: process.env.MONGO_DNS || 'mongodb://localhost:27017/mestodb',
  SERVER_PORT: process.env.SERVER_PORT || 3000,
  URL_PATTERN: /^https?:(www\.)?[a-zа-яё\d\-._~:/?#[\]@!$&'()*+,;=]+#?$/i,
};
