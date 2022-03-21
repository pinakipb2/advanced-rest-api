import createError from 'http-errors';
import { User } from '../models';

const admin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (user.role === 'admin') {
      next();
    } else {
      return next(createError.Unauthorized());
    }
  } catch (err) {
    return next(createError.InternalServerError());
  }
};

export default admin;
