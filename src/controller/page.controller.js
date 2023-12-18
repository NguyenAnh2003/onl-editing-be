import mongoose from 'mongoose';
import { createPageService, exportPDFService, getDataByPageIdService, getPagesByUserIdService } from '../services/page.services.js';
import { decryptHelper, encryptHelper } from '../utils/cipher.utils.js';

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

/** export pdf file */
export const exportPDFController = async (req, res) => {
  const { encryptedRequest } = req.body;
  const { delta, filename } = decryptHelper(encryptedRequest);
  try {
    /** pdf service */
    const url = await exportPDFService(delta, filename);
    if (url) {
      const encryptedResponse = encryptHelper(url);
      console.log(encryptedResponse);
      res.status(200).send(encryptedResponse);
    } else {
      res.status(500).send('Error exporting pdf file');
    }
  } catch (error) {
    console.error(error);
  }
};
