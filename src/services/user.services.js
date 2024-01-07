import User from '../schema/user.schema.js';
import bcrypt from 'bcryptjs';

/** login service */
export const userLoginService = async (name, password) => {
  try {
    const user = await User.findOne({ name: name });
    /** password encrypt */
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        return {
          userId: user._id,
          username: user.name,
        };
      } else return;
    } else {
      return;
    }
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

/** signup service */
export const userRegisterService = async (name, password) => {
  try {
    const newUser = new User({
      name: name,
      password: bcrypt.hashSync(password),
    });
    const user = await newUser.save();
    return { username: user.name, id: user._id };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

/** search person */
export const searchUserService = async (name) => {
  try {
    /** setting username to unique */
    const user = await User.findOne({ name: name });
    return {
      userId: user._id,
      username: user.name,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
