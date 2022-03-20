import createError from 'http-errors';

import JwtService from '../services/JwtService';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError.Unauthorized());
  }
  const token = authHeader.split(' ')[1];
  try {
    const { _id } = await JwtService.verify(token);
    const user = { _id };
    req.user = user;
    next();
  } catch (err) {
    return next(createError.Unauthorized());
  }
};

export default auth;
