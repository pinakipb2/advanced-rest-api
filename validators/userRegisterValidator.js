import Joi from 'joi';

/* The incoming request must have name, email, password, and confirm_password */
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).trim().required(),
  confirm_password: Joi.ref('password'),
});

export default registerSchema;
