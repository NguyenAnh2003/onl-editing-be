import { searchUserService, userLoginService, userRegisterService } from '../services/user.services.js';

export const userLoginController = async (req, res) => {
  const { name, password } = req.body;
  try {
    const rs = await userLoginService(name, password);
    res.status(200).send(rs);
  } catch (error) {
    console.error(error);
  }
};

export const userRegisterController = async (req, res) => {
  const { name, password } = req.body;
  try {
    const rs = await userRegisterService(name, password);
    res.status(200).send(rs);
  } catch (error) {
    console.error(error);
  }
};

/** search user name: unique */
export const searchUserController = async (req, res) => {
  const { name } = req.params;
  try {
    const rs = await searchUserService(name);
    res.status(200).send(rs);
  } catch (error) {
    console.error(error);
  }
};
