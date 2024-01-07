import { searchUserService, userLoginService, userRegisterService } from '../services/user.services.js';
import { decryptHelper, encryptHelper } from '../utils/cipher.utils.js';

export const userLoginController = async (req, res) => {
  /** get encrypted data */
  const { encryptedData } = req.body;
  /** destructuring encrypted data */
  const decryptedData = decryptHelper(encryptedData);
  const { name, password } = decryptedData;
  try {
    const rs = await userLoginService(name, password);
    if (rs) {
      /** encrypt data before send */
      const encryptedResponse = encryptHelper(rs);
      console.log(encryptedResponse);
      res.status(200).send(encryptedResponse);
    } else {
      res.status(401).send('Invalid name or password');
    }
  } catch (error) {
    console.error(error);
  }
};

export const userRegisterController = async (req, res) => {
  const { encryptedData } = req.body;
  const decryptedData = decryptHelper(encryptedData);
  const { name, password } = decryptedData;
  console.log(name, password);
  try {
    const rs = await userRegisterService(name, password);
    if (rs) {
      const responseData = decryptHelper(rs)
      res.status(200).send(responseData);
    } else res.status(400).send('BAD REQUEST');
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
