/* REST API version V1
   Author: Pinaki Bhattacharjee
*/
import express from 'express';
import './config/init_env';
const morgan = require('morgan');
import createError from 'http-errors';
import path from 'path';

import routes from './routes';

import { DBConnect, RedisClient } from './config';

const app = express();
// Global variable appRoot with base dirname
global.appRoot = path.resolve(__dirname);

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));

// Connecting to MongoDB
DBConnect();
// Connecting to Redis
const RedisConnect = async () => {
  await RedisClient.connect();
};
RedisConnect();

/* Welcome Route */
app.all('/', async (req, res, next) => {
  res.send({ message: 'Welcome to REST API 😎' });
});

/* Home Route */
app.all('/api/v1', async (req, res, next) => {
  res.send({ message: 'Welcome to REST API V1 😎' });
});

/* Configuring routes to use API versioning */
app.use('/api/v1', routes);

/* Custom error handler, fallback to 404 error */
app.use((req, res, next) => {
  next(createError.NotFound());
});

/* Custom error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

/* Specifying port & server startup message */
const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
