import Joi from 'joi';

/* The incoming request must have a refresh token */
const refreshSchema = Joi.object({
  refresh_token: Joi.string().trim().required(),
});

export default refreshSchema;
