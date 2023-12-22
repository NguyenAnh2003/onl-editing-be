import Colab from '../schema/colabs.schema.js';

/** add user to page */
export const addUser2PageService = async (userId, pageId, username) => {
  /**
   * @param userId
   * @param pageId
   * is userId and pageId already exist in DB -> blocking
   */
  console.log(userId, pageId);
  try {
    const colab = await Colab.findOne({ pageId: pageId, userId: userId });
    if (colab) {
      return;
    } else {
      const newColab = new Colab({
        pageId: pageId,
        userId: userId,
        username: username,
        mode: 'edit',
      });
      const rs = await newColab.save();
      console.log(rs);
      return rs;
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * getColab page by userId
 * https://kb.objectrocket.com/mongo-db/use-mongoose-to-find-in-an-array-of-objects-1206
 * */
export const getColabPageService = async (userId) => {
  try {
    const rs = await Colab.find({ userId: userId });
    return rs;
  } catch (error) {
    console.error(error);
  }
};

export const getColabsByPageIdService = async (pageId) => {
  try {
    const rs = await Colab.find({ pageId: pageId });
    if (rs) return rs;
    else return null;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateUserModeService = async (userId, pageId, mode) => {
  try {
    const rs = await Colab.findOneAndUpdate({ userId: userId, pageId: pageId }, { mode: mode }, { new: true });
    return rs;
  } catch (error) {
    throw new Error(error);
  }
};
