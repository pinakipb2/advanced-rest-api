import Joi from 'joi';
import createError from 'http-errors';

import { User } from '../../models';
import JwtService from '../../services/JwtService';
import RedisClient from '../../config/init_redis';

const refreshController = {
  async refresh(req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().trim().required(),
    });
    try {
      const result = await refreshSchema.validateAsync(req.body);
      if (!result.refresh_token) {
        return next(createError.Unauthorized('Invalid Refresh Token'));
      }
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
      const access_token = JwtService.sign({ _id: user._id });
      const refresh_token = JwtService.sign({ _id: user._id }, '1y', process.env.REFRESH_SECRET);
      await RedisClient.set(user._id, refresh_token, { EX: 365 * 24 * 60 * 60 });
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
