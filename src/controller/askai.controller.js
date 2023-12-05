import OpenAI from 'openai';
/**
 * controller call openai service through openai api key
 */
const apiKey = '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';
const openai = new OpenAI({
  apiKey: apiKey,
});

export const askAIController = async (prompt) => {
  try {
    const getResponse = async () => {
      try {
        const rs = await openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
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
