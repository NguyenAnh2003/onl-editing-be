import {
  createPageService,
  deletePage,
  exportPDFService,
  getDataByPageIdService,
  getPagesByUserIdService,
  updatePageNameService,
} from "../services/page.services.js";
import { decryptHelper, encryptHelper } from "../utils/cipher.utils.js";

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
    if (rs) res.status(200).send(rs);
  } catch (error) {
    console.error(error);
    res.status(500).send("Cannot get page data");
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
      res.status(500).send("Error exporting pdf file");
    }
  } catch (error) {
    console.error(error);
  }
};

/** update page name */
export const updatePageNameControllter = async (req, res) => {
  const { pageId } = req.params;
  const { name } = req.body;
  try {
    const rs = await updatePageNameService(pageId, name);
    if (rs) res.status(200).send("Updated");
    else res.status(404).send("NOT FOUND");
  } catch (error) {
    res.status(500).send("Internal error cannot update name this page");
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
    if (rs) res.status(200).send("Delete successfully");
  } catch (error) {
    res.status(500).send("Cannot delete page");
  }
};
