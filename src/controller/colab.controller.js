import { addUser2PageService, getColabPageService } from '../services/colab.services.js';

/** addU2Pge */
export const addUser2PageController = async (req, res) => {
  const { userId, pageId } = req.body;
  try {
    const rs = await addUser2PageService(userId, pageId);
    if (rs) {
      res.status(200).json(`Success adding to ${pageId}`);
    } else {
      res.status(400).send('User already exist');
      console.log('something wrong');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal error');
  }
};

/** getColabPage */
export const getColabPageController = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      console.error('userId undefined');
      return;
    }
    const rs = await getColabPageService(userId);
    res.status(200).send(rs);
  } catch (error) {
    console.error(error);
  }
};
