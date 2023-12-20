import Page from '../schema/page.schema.js';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import pdf from 'html-pdf';
import fs from 'fs';
import { uploadPdfService } from './file.service.js';
/** REST */
export const createPageService = async (userId, pageName) => {
  try {
    const page = new Page({
      userId: userId,
      name: pageName,
      /** empty content, mode */
      mode: '',
      content: '',
    });
    const result = await page.save();
    /** returning result */
    return result;
  } catch (error) {
    console.error(error);
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
  }
};

/** getPage by pageId used for */
export const getDataByPageIdService = async (pageId) => {
  if (!pageId) return;
  const page = await Page.findById(pageId);
  return page;
};

/** delete page */
export const deletePage = async (id) => {
  try {
    const result = Page.deleteOne({ _id: id });
    console.log('delete service', result);
    if (result) return result;
    else return null;
  } catch (error) {
    throw new Error(error);
  }
};

/** Ws update content */
export const updatePage = async (id, data) => {
  return await Page.findByIdAndUpdate(id, { $set: { content: data } }, { new: true });
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
      pdf.create(html, { format: 'A4' }).toBuffer(async (err, res) => {
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
  }
};
