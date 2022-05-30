import createError from 'http-errors';
import { User } from '../models';

/* Checks if the current authenticated and authorized user has the
  required "Admin" role to perform the action
*/
const admin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    /* Checks the current logged in users role and
    upon validation throws error or passes onto next request
    */
    if (user.role === 'ADMIN') {
      next();
    } else {
      return next(createError.Unauthorized());
    }
  } catch (err) {
    return next(createError.InternalServerError());
  }
};

export default admin;
