import Doc from '../schema/page.schema.js';

export const createDocumemt = async (docId) => {
  try {
    const doc = new Doc({
      _id: docId,
      data: '',
    });
    const result = await doc.save();
    /** returning result */
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getDocumemt = async (docId) => {
  if (!docId) return;
  const doc = await Doc.findById(docId);
  if (doc) return doc;
  return await createDocumemt(docId);
};

export const updateDocumemt = async (id, data) => {
  return await Doc.findByIdAndUpdate(id, { data });
};
