import User from '../schema/user.schema.js';

export const userLoginService = async (name, password) => {
  try {
    const user = await User.findOne({ name: name });
    return user.name;
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
