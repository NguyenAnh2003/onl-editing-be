import Page from "../schema/page.schema.js";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import pdf from "html-pdf";
import { uploadPdfService } from "./file.service.js";
import Colab from "../schema/colabs.schema.js";

/** REST */
export const createPageService = async (userId, pageName) => {
  try {
    const page = new Page({
      userId: userId,
      name: pageName,
      /** empty content, mode */
      mode: "",
      content: "",
    });
    const result = await page.save();
    /** returning result */
    return result;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

/** getPage by pageId used REST */
export const getPagesByUserIdService = async (userId) => {
  /**
   * @param userId
   * @returns list of pages that userId owns
   */
  try {
    if (!userId) return;
    const page = await Page.find({ userId: userId });
    return page;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

/** getPage by pageId used for */
export const getDataByPageIdService = async (pageId) => {
  try {
    if (!pageId) return;
    const page = await Page.findById(pageId);
    return page;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

/** delete page */
export const deletePage = async (id) => {
  /**
   * delete page by pageId
   * delete colabs {
   * 1. searching for colab
   * 2. if else colab result
   * 3. delete colab if result
   * }
   * if (pageResult || (pageResult && colabResult)) return rs
   */
  try {
    const colabPages = await Colab.find({ pageId: id });
    if (colabPages) {
      const clResult = await Colab.deleteMany({ pageId: id });
      const result = await Page.deleteOne({ _id: id });
      if (clResult && result) return { clResult, result };
      else return;
    } else {
      const result = await Page.deleteOne({ _id: id });
      if (result) return result;
      else return;
    }
  } catch (error) {
    throw new Error(error);
  }
};

/** update page name */
export const updatePageNameService = async (id, name) => {
  try {
    return await Page.findByIdAndUpdate(id, { $set: { name } }, { new: true });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

/** Ws update content */
export const updatePageService = async (id, data) => {
  try {
    return await Page.findByIdAndUpdate(id, { $set: { content: data } }, { new: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

/** export PDF REST */
export const exportPDFService = async (delta, filename) => {
  try {
    return new Promise((resolve, reject) => {
      const converter = new QuillDeltaToHtmlConverter(delta.ops, {});
      const html = converter.convert();
      /**
       * replace toFile with toBuffer
       * passing buffer to uploadPDF service
       * to get URL
       */
      pdf.create(html, { format: "A4" }).toBuffer(async (err, res) => {
        if (err) {
          reject(err);
        } else {
          const result = await uploadPdfService(res, `${filename}.pdf`);
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
