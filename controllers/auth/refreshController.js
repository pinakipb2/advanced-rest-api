import Joi from 'joi';
import createError from 'http-errors';

import { User } from '../../models';
import JwtService from '../../services/JwtService';
import RedisClient from '../../config/init_redis';

import { refreshSchema } from '../../validators';

const refreshController = {
  /* Controller for user to refresh the access and refresh token */
  async refresh(req, res, next) {
    /* The incoming request must have a refresh token */
    try {
      // Validating the incoming request schema
      const result = await refreshSchema.validateAsync(req.body);
      if (!result.refresh_token) {
        return next(createError.Unauthorized('Invalid Refresh Token'));
      }
      let userId;
      try {
        /* Verifying the validity of the refresh token and checking if the token exists in Redis */
        const { _id } = await JwtService.verify(result.refresh_token, process.env.REFRESH_SECRET);
        userId = _id;
        const token = await RedisClient.get(_id);
        if (!token || token != result.refresh_token) {
          return next(createError.Unauthorized('Invalid Refresh Token'));
        }
      } catch (err) {
        return next(createError.Unauthorized('Invalid Refresh Token'));
      }
      /* Checking if the user exists in the DB */
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return next(createError.Unauthorized('No User Found'));
      }
      /* Sign an access and a refresh token with userid as payload
         Access token has an expiry of 30 mins
         Refresh token has an expiry of 1 yr
      */
      const access_token = JwtService.sign({ _id: user._id });
      const refresh_token = JwtService.sign({ _id: user._id }, '1y', process.env.REFRESH_SECRET);
      // Adding refresh token to redis
      await RedisClient.set(user._id, refresh_token, { EX: 365 * 24 * 60 * 60 });
      // Send the new access and refresh token as reponse
      res.json({ access_token, refresh_token });
    } catch (err) {
      if (err.isJoi === true) {
        return next(createError.UnprocessableEntity(err.message));
      }
      return next(createError.InternalServerError());
    }
  },
};
export default refreshController;
