import Joi from 'joi';
import createError from 'http-errors';
import bcrypt from 'bcrypt';

import { User } from '../../models';
import JwtService from '../../services/JwtService';
import RedisClient from '../../config/init_redis';

const loginController = {
  async login(req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().email().lowercase().trim().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).trim().required(),
    });
    try {
      const result = await loginSchema.validateAsync(req.body);
      const { email, password } = result;
      const user = await User.findOne({ email });
      if (!user) {
        return next(createError.Unauthorized());
      }
      const matchPassword = await bcrypt.compare(password, user.password);
      if (!matchPassword) {
        return next(createError.Unauthorized());
      }
      const token = await RedisClient.get(user._id);
      if (token) {
        return next(createError.Unauthorized('User is already logged in'));
      }
      const access_token = JwtService.sign({ _id: user._id });
      const refresh_token = JwtService.sign({ _id: user._id }, '1y', process.env.REFRESH_SECRET);
      // Adding refresh token to redis
      await RedisClient.set(user._id, refresh_token, { EX: 365 * 24 * 60 * 60 });
      res.json({ access_token, refresh_token });
    } catch (err) {
      if (err.isJoi === true) {
        return next(createError.UnprocessableEntity(err.message));
      }
      return next(createError.InternalServerError());
    }
  },
  async logout(req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().trim().required(),
    });
    try {
      const result = await refreshSchema.validateAsync(req.body);
      let userId;
      try {
        const { _id } = await JwtService.verify(result.refresh_token, process.env.REFRESH_SECRET);
        userId = _id;
        const token = await RedisClient.get(_id);
        if (!token || token != result.refresh_token) {
          return next(createError.Unauthorized('Invalid Refresh Token'));
        }
      } catch (err) {
        return next(createError.Unauthorized('Invalid Refresh Token'));
      }
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return next(createError.Unauthorized('No User Found'));
      }
      try {
        await RedisClient.del(user._id);
      } catch (err) {
        return next(createError.InternalServerError());
      }
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
