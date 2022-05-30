import Joi from 'joi';

/* The incoming request must have a password and same password as confirm_password */
const resetPasswordSchemaOnBody = Joi.object({
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).trim().required(),
  confirm_password: Joi.ref('password'),
});

export default resetPasswordSchemaOnBody;
