import express from 'express';
import './config/init_env';
const morgan = require('morgan');
import createError from 'http-errors';

import routes from './routes';

import { DBConnect, RedisClient } from './config';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

DBConnect();
const RedisConnect = async () => {
  await RedisClient.connect();
};
RedisConnect();

app.get('/', async (req, res, next) => {
  res.send({ message: 'Welcome to REST API 😎' });
});

app.get('/api/v1', async (req, res, next) => {
  res.send({ message: 'Welcome to REST API V1 😎' });
});

app.use('/api/v1', routes);

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
