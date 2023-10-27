import { createPageService } from '../services/page.services.js';

export const createPageController = async (req, res) => {
  const { userId } = req.body;
  try {
    const rs = await createPageService(userId);
    res.status(200).send(rs);
  } catch (error) {
    console.error(error);
  }
};
