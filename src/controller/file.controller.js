import { uploadeImageService } from '../services/file.service.js';

export const uploadImageController = async (req, res) => {
  if (!req.files) {
    res.status(400).send('NO FILE');
    return;
  }
  const file = req.files?.file;
  console.log('file from client', file);
  try {
    const result = await uploadeImageService(file);
    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal error');
  }
};
