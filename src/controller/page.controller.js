import { createPageService, deletePage, exportPDFService, getDataByPageIdService, getPagesByUserIdService, updatePageService } from '../services/page.services.js';
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
  console.log(decryptHelper(encryptedRequest));
  const { delta, filename } = decryptHelper(encryptedRequest);
  try {
    /** pdf service */
    const url = await exportPDFService(delta, filename);
    if (url) {
      const encryptedResponse = encryptHelper(url);
      res.status(200).send(encryptedResponse);
    } else {
      res.status(500).send('Error exporting pdf file');
    }
  } catch (error) {
    console.error(error);
  }
};

/** update Page controller for WS */
export const updatePageController = async (id, content) => {
  /**
   * @param content
   * used for WS update
   */
  try {
    const result = await updatePageService(id, content);
    return result;
  } catch (error) {
    throw new Error(error.message); // throw Error can be used for WS
  }
};

/** delete page controller */
export const deletePageController = async (req, res) => {
  try {
    const { pageId } = req.params;
    console.log(pageId);
    const rs = await deletePage(pageId);
    console.log(rs);
    if (rs) res.status(200).send('Delete successfully');
  } catch (error) {
    res.status(500).send('Cannot delete page');
  }
};
