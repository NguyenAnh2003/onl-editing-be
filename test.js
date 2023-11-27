import OpenAI from 'openai';
const apiKey = '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';

const openai = new OpenAI({
  apiKey: apiKey,
});

const getResponse = async (prompt) => {
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

const hehe = async () => {
  const res = await getResponse('Where is VN');
  console.log(res);
};

hehe();
