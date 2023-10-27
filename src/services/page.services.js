import Page from '../schema/page.schema.js';

/** REST */
export const createPageService = async (userId, pageName) => {
  try {
    const page = new Page({
      userId: userId,
      name: pageName,
    });
    const result = await page.save();
    /** returning result */
    return result;
  } catch (error) {
    console.error(error);
  }
};

/** getPage by pageId used for Ws */
export const getPagesByUserIdService = async (userId) => {
  /**
   * @param userId
   * @returns list of pages that userId owns
   */
  try {
    if (!userId) return;
    const page = await Page.find({ userId });
    return page;
  } catch (error) {
    console.error(error);
  }
};

/** getPage by pageId used for Ws */
export const getPage = async (pageId) => {
  if (!pageId) return;
  const page = await Page.findById(pageId);
  if (page) return page;
  return await createPage(pageId);
};

/** Ws update content */
export const updatePage = async (id, data) => {
  return await Page.findByIdAndUpdate(id, { data });
};

/** delete page using REST pass pageId */
// export default deletePage = async (pageId) => {
//   const rs = await Page.findOneAndUpdate({});
//   return rs;
// };
