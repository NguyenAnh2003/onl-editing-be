import { getResponse } from '../services/askai.service.js';

export const askAIController = async (req, res) => {
  const prompt = 'Where is VN';
  const result = await getResponse(prompt);
  try {
    if (result) {
      res.send(result);
    } else {
      return;
    }
  } catch (error) {
    console.error(error);
  }
};
