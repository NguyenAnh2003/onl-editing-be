import { searchUserService, userLoginService, userRegisterService } from '../services/user.services.js';

export const userLoginController = async (req, res) => {
  const { name, password } = req.body;
  try {
    const rs = await userLoginService(name, password);
    if (rs) res.status(200).send(rs);
    else res.status(401).send('Invalid name or password');
  } catch (error) {
    console.error(error);
  }
};

export const userRegisterController = async (req, res) => {
  const { name, password } = req.body;
  console.log(name, password);
  try {
    const rs = await userRegisterService(name, password);
    if (rs) res.status(200).send(rs);
    else res.status(400).send('BAD REQUEST');
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
