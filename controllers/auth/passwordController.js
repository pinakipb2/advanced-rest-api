import createError from 'http-errors';
import { User } from '../../models';
import JwtService from '../../services/JwtService';
import bcrypt from 'bcrypt';

import { emailSchema, resetPasswordSchemaOnParams, resetPasswordSchemaOnBody } from '../../validators';
import { userDTO } from '../../dtos';

const passwordController = {
  /* Controller for user to send a req for forgot password */
  async forgot(req, res, next) {
    try {
      // Validating the incoming request schema
      const result = await emailSchema.validateAsync(req.body);
      const { email } = result;
      // Checking if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return next(createError.Unauthorized('No User Found'));
      }
      // If the user exists, create and send a one time link valid for 15 mins
      const UNIQUE_SECRET = process.env.PASSWORD_RESET_JWT_SECRET + user._doc.password;
      const payload = {
        _id: user._id,
        email: user._doc.email,
      };
      // Generate a unique token valid for 15 mins
      const uniqueToken = JwtService.sign(payload, '15m', UNIQUE_SECRET);
      // Send this link to user's email : <IMPORTANT STEP>
      const resetPasswordLink = `${process.env.APP_URL}/reset-password/${user._id}/${uniqueToken}`;
      // Sending the email and reset link as success response
      res.json({ email: user._doc.email, resetPasswordLink });
    } catch (err) {
      if (err.isJoi === true) {
        return next(createError.UnprocessableEntity(err.message));
      }
      return next(createError.InternalServerError());
    }
  },
  /* Controller for user to send a req for forgot password */
  async reset(req, res, next) {
    try {
      // Validating the incoming request schema
      const params = await resetPasswordSchemaOnParams.validateAsync(req.params);
      const body = await resetPasswordSchemaOnBody.validateAsync(req.body);
      const { id, token } = params;
      const { password } = body;
      // Checking if the user exists
      const user = await User.findOne({ _id: id });
      if (!user) {
        return next(createError.Unauthorized('Invalid Reset Link'));
      }
      // Recreating the unique secret
      const UNIQUE_SECRET = process.env.PASSWORD_RESET_JWT_SECRET + user._doc.password;
      try {
        /* Here the incoming token from params would be validated */
        const { _id, email } = await JwtService.verify(token, UNIQUE_SECRET);
        /* Hash the password with 10 salt rounds */
        const hashedPassword = await bcrypt.hash(password, 10);
        // Update the user with new Password
        let updatedUser = await User.findByIdAndUpdate(
          { _id },
          {
            $set: {
              password: hashedPassword,
            },
          },
          {
            new: true,
          }
        );
        updatedUser = new userDTO(updatedUser);
        // Return the updated user as success response
        res.json(updatedUser);
      } catch (err) {
        return next(createError.Unauthorized('Invalid Reset Link'));
      }
    } catch (err) {
      if (err.isJoi === true) {
        return next(createError.UnprocessableEntity(err.message));
      }
      return next(createError.InternalServerError());
    }
  },
};

export default passwordController;
