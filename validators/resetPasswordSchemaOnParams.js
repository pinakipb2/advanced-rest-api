import Joi from 'joi';

/* The incoming request must have an id and a token */
const resetPasswordSchemaOnParams = Joi.object({
  id: Joi.string().trim().required(),
  token: Joi.string().trim().required(),
});

export default resetPasswordSchemaOnParams;
