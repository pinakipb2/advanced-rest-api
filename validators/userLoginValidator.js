import Joi from 'joi';

/* The incoming request must have an email and a password */
const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).trim().required(),
});

export default loginSchema;
