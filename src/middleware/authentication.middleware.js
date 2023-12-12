import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const authenticate = (req, res, next) => {
  const authorization = req.headers['Authorization'];
  const token = authorization && authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'None token' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.status(401).send({ message: 'Invalid token' });
    } else {
      req.user = decode;
      next();
    }
  });
};
