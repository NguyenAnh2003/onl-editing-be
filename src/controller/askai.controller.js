import { askAIService } from '../services/askai.service.js';

export const askAIController = async (content, role) => {
  /**
   * @param content
   * @param role
   * use for WS protocol
   */
  try {
    const result = await askAIService(content, role);
    return result ? result : null;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
