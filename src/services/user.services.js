import User from '../schema/user.schema.js';

export const userLoginService = async (name, password) => {
  try {
    const user = await User.findOne({ name: name });
    return user.name;
  } catch (error) {
    console.error(error);
  }
};
