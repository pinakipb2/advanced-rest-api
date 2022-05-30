import Joi from 'joi';

/* The incoming request must have a name, price and image is optional */
const productSchema = Joi.object({
  name: Joi.string().trim().required(),
  price: Joi.number().required(),
  image: Joi.string(),
});

export default productSchema;
