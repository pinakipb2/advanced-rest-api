import createError from 'http-errors';
import JwtService from '../services/JwtService';

/* Checks if the current user is correctly logged in.
  In other words, it validated the authenticity of the bearer token
*/
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError.Unauthorized());
  }
  /* 0th index is "Bearer" and 1st index is the " JWT Token" */
  const token = authHeader.split(' ')[1];
  try {
    // Checks the validity of the "Token"
    const { _id } = await JwtService.verify(token);
    const user = { _id };
    /* Sets the (request variable) -> "user" as the current user
       For upcoming requests to reference
    */
    req.user = user;
    next();
  } catch (err) {
    return next(createError.Unauthorized());
  }
};

export default auth;
