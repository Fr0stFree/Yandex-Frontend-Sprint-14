const express = require('express');
const { errors } = require('celebrate');

const { SERVER_PORT, MONGO_DNS } = require('./config');
const router = require('./routes/index');
const { errorHandler } = require('./middleware');
const connectToMongo = require('./core/db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errors());
app.use(errorHandler);

app.listen(SERVER_PORT, async () => {
  await connectToMongo(MONGO_DNS);
});
