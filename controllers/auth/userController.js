import createError from 'http-errors';
import { userDTO } from '../../dtos';

import { User } from '../../models';

const userController = {
  /* Controller for user to "whoami" */
  async me(req, res, next) {
    try {
      /* Use a "DTOs" or "select" from built in mongoose
         _id, password, updatedAt and __v are removed
         Best alternative is to use DTO to rename _id to id
         and remove other non-necessary fields
      */
      // const user = await User.findOne({ _id: req.user._id }).select('-_id -password -updatedAt -__v');
      const user = await User.findOne({ _id: req.user._id });
      // If user is not found in DB throw NotFound error
      if (!user) {
        return next(createError.NotFound());
      }
      const IAM = new userDTO(user);
      // Return the User as success response
      res.json(IAM);
    } catch (err) {
      return next(createError.Unauthorized());
    }
  },
};

export default userController;
