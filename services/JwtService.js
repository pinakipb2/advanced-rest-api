import jwt from 'jsonwebtoken';

class JwtService {
  // Signs a JWT with given payload and secret with a default validity of 30 mins
  static sign(payload, expiry = '30m', secret = process.env.JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }

  // Verifies the validity of the JWT token, takes in the token and secret
  static verify(token, secret = process.env.JWT_SECRET) {
    return jwt.verify(token, secret);
  }
}

export default JwtService;
