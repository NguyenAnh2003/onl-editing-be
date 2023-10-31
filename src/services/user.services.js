import User from '../schema/user.schema.js';

export const userLoginService = async (name, password) => {
  try {
    const user = await User.findOne({ name: name });
    return {
      userId: user._id,
      username: user.name,
    };
  } catch (error) {
    console.error(error);
  }
};

export const userRegisterService = async (name, password) => {
  try {
    const newUser = new User({
      name: name,
      password: password,
    });
    const user = await newUser.save();
    return user;
  } catch (error) {
    console.error(error);
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
  }
};
