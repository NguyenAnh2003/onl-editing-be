import Page from '../schema/page.schema.js';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import pdf from 'html-pdf';
import fs from 'fs';
import { uploadPdfService } from '../libs/upload.js';
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
      pdf.create(html, { format: 'A4' }).toFile(`${filename}.pdf`, async (err, res) => {
        if (err) {
          reject(err);
        } else {
          const buffer = await fs.promises.readFile(res.filename);
          const result = await uploadPdfService(buffer, `${filename}.pdf`);
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};
