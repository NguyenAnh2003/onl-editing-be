import OpenAI from 'openai';
/**
 * controller call openai service through openai api key
 */
const apiKey = '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';
const openai = new OpenAI({
  apiKey: apiKey,
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
