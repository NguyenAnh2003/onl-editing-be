import mongoose from 'mongoose';
import { addUser2PageService, createPageService, getColabPageService, getDataByPageIdService, getPagesByUserIdService } from '../services/page.services.js';

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

/** addU2Pge */
export const addUser2PageController = async (req, res) => {
  const { userId, pageId } = req.body;
  try {
    const rs = await addUser2PageService(userId, pageId);
    res.status(200).json(`Success adding to ${pageId}`);
  } catch (error) {
    console.error(error);
  }
};

/** getColabPage */
export const getColabPageController = async (req, res) => {
  const { userId } = req.params;
  try {
    const rs = await getColabPageService(userId);
    res.status(200).send(rs);
  } catch (error) {
    console.error(error);
  }
};

/** getDataByPageId */
export const getDataByPageIdController = async (req, res) => {
  const { pageId } = req.params;
  try {
    const rs = await getDataByPageIdService(pageId);
    res.status(200).send(rs);
  } catch (error) {
    console.error(error);
  }
};
