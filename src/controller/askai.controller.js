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
