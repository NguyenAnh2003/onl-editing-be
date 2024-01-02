import { addUser2PageService, getColabPageService, getColabsByPageIdService, getOneColabPageService, updateUserModeService } from '../services/colab.services.js';

/** addU2Pge */
export const addUser2PageController = async (req, res) => {
  const { userId, pageId, username } = req.body;
  try {
    const rs = await addUser2PageService(userId, pageId, username);
    if (rs) {
      res.status(200).json(`Success adding to ${pageId}`);
    } else {
      res.status(404).send('User already exist');
      console.log('something wrong');
    }
  } catch (error) {
    console.error(error);
  }
};

/** getColabPage by UserId */
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

/** getColabPages by PageId */
export const getColabPageByPageIdController = async (req, res) => {
  const { pageId } = req.params;
  try {
    const rs = await getColabsByPageIdService(pageId);
    if (rs) res.status(200).send(rs);
  } catch (error) {
    res.status(500).send('Internal error');
    throw new Error(error);
  }
};

/** getOneColabPage */
export const getOneColabPageController = async (req, res) => {
  const { pageId, userId } = req.params;
  try {
    const rs = await getOneColabPageService(userId, pageId);
    if (rs) res.status(200).send(rs);
  } catch (error) {
    res.status(500).send('Internal error');
  }
};

/** update mode */
export const updateUserModeController = async (req, res) => {
  const { userId, pageId, mode, username } = req.body;
  console.log({ userId, pageId, mode, username });
  try {
    if (mode !== '' || mode !== ' ') {
      const rs = await updateUserModeService(userId, pageId, mode);
      console.log(rs);
      if (rs) res.status(200).send(rs);
    } else res.status(400).send('Mode is empty');
  } catch (error) {
    throw new Error(error);
  }
};
