import Page from '../schema/page.schema.js';

/** REST */
export const createPageService = async (userId, pageName) => {
  try {
    const page = new Page({
      userId: userId,
      name: pageName,
      /** empty content, mode */
      mode: '',
      content: '',
    });
    const result = await page.save();
    /** returning result */
    return result;
  } catch (error) {
    console.error(error);
  }
};

/** getPage by pageId used REST */
export const getPagesByUserIdService = async (userId) => {
  /**
   * @param userId
   * @returns list of pages that userId owns
   */
  try {
    if (!userId) return;
    const page = await Page.find({ userId: userId });
    return page;
  } catch (error) {
    console.error(error);
  }
};

/** getPage by pageId used for */
export const getDataByPageIdService = async (pageId) => {
  if (!pageId) return;
  const page = await Page.findById(pageId);
  return page;
};

/** Ws update content */
export const updatePage = async (id, data) => {
  return await Page.findByIdAndUpdate(id, { data });
};

/** add user to page */
export const addUser2PageService = async (userId, pageId) => {
  console.log(userId, pageId);
  try {
    const rs = await Page.findByIdAndUpdate(pageId, { $addToSet: { colabs: { userId: userId } } });
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
    const rs = await Page.find({ 'colabs.userId': userId });
    return rs;
  } catch (error) {
    console.error(error);
  }
};

/** delete page using REST pass pageId */
// export default deletePage = async (pageId) => {
//   const rs = await Page.findOneAndUpdate({});
//   return rs;
// };
