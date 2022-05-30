import Joi from 'joi';

/* The incoming request must have an email */
const emailSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

export default emailSchema;
