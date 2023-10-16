import Doc from '../schema/document.schema.js';

export const createDocumemt = async (name) => {
  try {
    const doc = new Doc({
      data: '',
      owner: name,
    });
    const result = await doc.save();
    /** returning result */
    return {
      docId: result._id,
      data: result.data,
      owner: result.owner,
    };
  } catch (error) {
    console.error(error);
  }
};

export const getDocumemt = async (docId) => {
  if (!docId) return;
  const doc = await Doc.findById(docId);
  return doc;
};

export const updateDocumemt = async (id, data) => {
  return await Doc.findByIdAndUpdate(id, { data });
};
