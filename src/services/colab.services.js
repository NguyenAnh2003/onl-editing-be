import Colab from '../schema/colabs.schema.js';

/** add user to page */
export const addUser2PageService = async (userId, pageId) => {
  console.log(userId, pageId);
  try {
    const newColab = new Colab({
      pageId: pageId,
      userId: userId,
    });
    const rs = await newColab.save();
    console.log(rs);
    return rs;
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
