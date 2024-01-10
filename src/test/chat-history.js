import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { MongoDBChatMessageHistory } from "@langchain/community/stores/message/mongodb";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import dotenv from "dotenv";

dotenv.config(); // env config

const OPENAI_API = process.env.OPENAI_KEY;

const model = new ChatOpenAI({
  openAIApiKey: OPENAI_API,
});

// prompt
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You're good at {ability}"],
  new MessagesPlaceholder("history"),
  ["human", "{question}"],
]);

const chain = prompt.pipe(model);

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: (sessionId) =>
    new MongoDBChatMessageHistory({
      collection, // collection mongodb
      sessionId,
    }),
    inputMessagesKey: "question",
    historyMessagesKey: 'history'
});
