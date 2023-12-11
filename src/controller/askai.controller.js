import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();
/** controller call openai service through openai api key*/
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export const askAIController = async (prompt, role) => {
  try {
    const getResponse = async () => {
      try {
        const rs = await openai.chat.completions.create({
          messages: [{ role: role, content: prompt }],
          model: 'gpt-3.5-turbo',
        });
        return rs.choices[0].message;
      } catch (error) {
        console.error(error);
      }
    };

    const result = await getResponse(prompt);

    if (result) {
      return result;
    } else {
      return;
    }
  } catch (error) {
    console.error(error);
  }
};
