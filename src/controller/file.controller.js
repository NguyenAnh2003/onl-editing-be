import { uploadCloudinary, uploadImageService } from '../services/file.service.js';

export const uploadImageController = async (file, filename) => {
  try {
    const rs = await uploadImageService(file, filename);
    if (rs) {
      return rs;
    } else return;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const uploadCloudinaryController = async (file) => {
  try {
    const rs = await uploadCloudinary(file);
    if (rs) return rs;
  } catch (error) {
    console.error(error);
  }
};
