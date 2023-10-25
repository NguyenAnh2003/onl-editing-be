import { createPageService } from '../services/page.services.js';

export const createPageController = async (req, res) => {
  const { pageId } = req.body;
  try {
    const rs = await createPageService(pageId);
    res.status(200).send(rs);
  } catch (error) {
    console.error(error);
  }
};
