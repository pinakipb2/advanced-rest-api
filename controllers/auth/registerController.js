import Joi from 'joi';
import createError from 'http-errors';
import bcrypt from 'bcrypt';

import { User } from '../../models';
import { userDTO } from '../../dtos';

import { registerSchema } from '../../validators';

const registerController = {
  /* Controller for user to register */
  async register(req, res, next) {
    /* The incoming request must have name, email, password, and confirm_password */
    try {
      // Validating the incoming request schema
      const result = await registerSchema.validateAsync(req.body);
      const { name, email, password } = result;
      /* Check if the user already exists, if exists throw Conflict(409) error */
      const exist = await User.exists({ email });
      if (exist) {
        return next(createError.Conflict('This email is already taken'));
      }
      /* Hash the password with 10 salt rounds */
      const hashedPassword = await bcrypt.hash(password, 10);
      /* Store the user in DB */
      const user = new User({ name, email, password: hashedPassword });
      let savedUser = await user.save();
      savedUser = new userDTO(savedUser);
      /* Return the stored user details as success response */
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
