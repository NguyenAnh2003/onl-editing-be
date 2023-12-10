import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../config/firebase.config.js';
import cloudinary from '../config/cloudinary.config.js';

initializeApp(firebaseConfig);

const storage = getStorage();
export const uploadPdfService = async (buffer, filename) => {
  try {
    const time = Date.now();
    const storageRef = ref(storage, `files/${filename + '-' + time}.pdf`);
    const snapshot = await uploadBytesResumable(storageRef, buffer);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error(error);
  }
};

/** with firebase */
export const uploadImageService = async (file, filename) => {
  try {
    const time = Date.now();
    const storageRef = ref(storage, `medias/${filename + '-' + time}.png`);
    const snapshot = await uploadBytesResumable(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error(error);
  }
};

/** with cloudinary */
export const uploadCloudinary = async (file) => {
  try {
    const rs = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream((error, result) => {
          return resolve(result);
        })
        .end(file);
    });
    if (rs) return rs.secure_url;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
