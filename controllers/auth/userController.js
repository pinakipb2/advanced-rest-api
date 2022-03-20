import createError from 'http-errors';

import { User } from '../../models';

const userController = {
  async me(req, res, next) {
    try {
      // Use a "DTOs" or "select" from built in mongoose
      const user = await User.findOne({ _id: req.user._id }).select('-_id -password -updatedAt -__v');
      if (!user) {
        return next(createError.NotFound());
      }
      res.json(user);
    } catch (err) {
      return next(createError.Unauthorized());
    }
  },
};

export default userController;
