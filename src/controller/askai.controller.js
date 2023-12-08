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
      if (role === 'user') {
        try {
          const rs = await openai.chat.completions.create({
            messages: [{ role: role, content: prompt }],
            model: 'gpt-3.5-turbo',
          });
          return rs.choices[0].message;
        } catch (error) {
          console.error(error);
        }
      } else return;
    };
    const result = await getResponse(prompt);
    return result ? result : null;
  } catch (error) {
    console.error(error);
  }
};
