import createError from 'http-errors';
import bcrypt from 'bcrypt';

import { User } from '../../models';
import JwtService from '../../services/JwtService';
import RedisClient from '../../config/init_redis';

import { refreshSchema, loginSchema } from '../../validators';

const loginController = {
  /* Controller for user to login */
  async login(req, res, next) {
    /* The incoming request must have an email and a password */
    try {
      // Validating the incoming request schema
      const result = await loginSchema.validateAsync(req.body);
      const { email, password } = result;
      const user = await User.findOne({ email });
      // If user not found in DB thorw Unauthorized error
      if (!user) {
        return next(createError.Unauthorized());
      }
      // If the passwords do not match throw Unauthorized error
      // ._doc bypasses the getter and fetches the actual value from DB
      const matchPassword = await bcrypt.compare(password, user._doc.password);
      if (!matchPassword) {
        return next(createError.Unauthorized());
      }
      // Check if the user is already logged in by checking into the Redis client
      const token = await RedisClient.get(user._id);
      // If the user is already logged in, throw error that the user is already logged in
      if (token) {
        return next(createError.Unauthorized('User is already logged in'));
      }
      /* Sign an access and a refresh token with userid as payload
         Access token has an expiry of 30 mins
         Refresh token has an expiry of 1 yr
      */
      const access_token = JwtService.sign({ _id: user._id });
      const refresh_token = JwtService.sign({ _id: user._id }, '1y', process.env.REFRESH_SECRET);
      // Adding refresh token to redis
      await RedisClient.set(user._id, refresh_token, { EX: 365 * 24 * 60 * 60 });
      // Send the access and refresh token as reponse
      res.json({ access_token, refresh_token });
    } catch (err) {
      if (err.isJoi === true) {
        return next(createError.UnprocessableEntity(err.message));
      }
      return next(createError.InternalServerError());
    }
  },
  /* Controller for user to logout */
  async logout(req, res, next) {
    /* The incoming request must have a refresh token */
    try {
      // Validating the incoming request schema
      const result = await refreshSchema.validateAsync(req.body);
      let userId;
      try {
        /* Here the incoming refresh token would be validated */
        const { _id } = await JwtService.verify(result.refresh_token, process.env.REFRESH_SECRET);
        userId = _id;
        /* Here the token would be retrived from the Redis client */
        const token = await RedisClient.get(_id);
        /* If the token is not present in the Redis client
           OR
           the incoming refresh token does not matches the token from the Redis client
           then throw an Unauthorized error
        */
        if (!token || token != result.refresh_token) {
          return next(createError.Unauthorized('Invalid Refresh Token'));
        }
      } catch (err) {
        return next(createError.Unauthorized('Invalid Refresh Token'));
      }
      /* Search for the user in the DB */
      const user = await User.findOne({ _id: userId });
      /* If user is not found throw Unauthorized error */
      if (!user) {
        return next(createError.Unauthorized('No User Found'));
      }
      /* Delete the refresh token from the Redis client */
      try {
        await RedisClient.del(user._id);
      } catch (err) {
        return next(createError.InternalServerError());
      }
      /* Send an respose that logout operation on that user has been performed successfully */
      res.json({ status: true });
    } catch (err) {
      if (err.isJoi === true) {
        return next(createError.UnprocessableEntity(err.message));
      }
      return next(createError.InternalServerError());
    }
  },
};

export default loginController;
