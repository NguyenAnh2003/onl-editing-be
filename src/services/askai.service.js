import OpenAI from 'openai';
import dotenv from 'dotenv';

// dotenv config
dotenv.config();

export const askAIService = async (content, role) => {
  /** Using OpenAi lib for calling response from GPT
   * @param content
   * @param role
   */

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  try {
    const getAiResponse = async (content) => {
      const res = await openai.chat.completions.create({
        messages: [{ role: role, content: content }],
        model: 'gpt-3.5-turbo',
      });
      return res.choices[0].message; // return message from ai
    };
    return await getAiResponse(content);
  } catch (error) {
    console.log('Message from askAI service', error.message);
    throw new Error(error);
  }
};
