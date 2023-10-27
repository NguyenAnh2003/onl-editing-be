import { createPageService, getPagesByUserIdService } from '../services/page.services.js';

export const createPageController = async (req, res) => {
  const { userId, pageName } = req.body;
  try {
    const rs = await createPageService(userId, pageName);
    res.status(200).send(rs);
  } catch (error) {
    console.error(error);
  }
};

export const getPagesByUserIdController = async (req, res) => {
  const { userId } = req.params;
  try {
    const rs = await getPagesByUserIdService(userId);
    res.status(200).send(rs);
  } catch (error) {
    console.error(error);
  }
};
