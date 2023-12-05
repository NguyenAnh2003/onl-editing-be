import OpenAI from 'openai';
const apiKey = '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';

const openai = new OpenAI({
  apiKey: apiKey,
});

export const getResponse = async (prompt) => {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    // console.log(chatCompletion.choices[0].message);
    return chatCompletion.choices[0].message;
  } catch (error) {
    console.error(error);
  }
};

