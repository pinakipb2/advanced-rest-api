import Joi from 'joi';
import createError from 'http-errors';
import bcrypt from 'bcrypt';

import { User } from '../../models';

const registerController = {
  async register(req, res, next) {
    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(50).trim().required(),
      email: Joi.string().email().lowercase().trim().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).trim().required(),
      confirm_password: Joi.ref('password'),
    });
    try {
      const result = await registerSchema.validateAsync(req.body);
      const { name, email, password } = result;
      const exist = await User.exists({ email });
      if (exist) {
        return next(createError.Conflict('This email is already taken'));
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      const savedUser = await user.save();
      res.send(savedUser);
    } catch (err) {
      if (err.isJoi === true) {
        return next(createError.UnprocessableEntity(err.message));
      }
      return next(createError.InternalServerError());
    }
  },
};

export default registerController;
