import { userLoginService } from '../services/user.services.js';

export const userLoginController = async (req, res) => {
  const { name, password } = req.body;
  try {
    const rs = await userLoginService(name, password);
    res.status(200).send(rs);
  } catch (error) {
    console.error(error);
  }
};
