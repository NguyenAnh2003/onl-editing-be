import jwt from 'jsonwebtoken';

export const createAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};
