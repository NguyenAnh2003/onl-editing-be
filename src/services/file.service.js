import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import firebaseConfig from '../config/firebase.config.js';

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
