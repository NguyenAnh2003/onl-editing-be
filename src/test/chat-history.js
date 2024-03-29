import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import {
  BufferMemory,
  ChatMessageHistory,
  ConversationSummaryBufferMemory,
} from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import dotenv from "dotenv";

dotenv.config(); // env config

const OPENAI_API = process.env.OPENAI_KEY;

const model = new ChatOpenAI({
  openAIApiKey: OPENAI_API,
});

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: OPENAI_API,
}); // openai's embedding

// prompt
const prompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "Give answer formally to user if there is based on given conversation. or else thought to answer"
  ),  
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

// define memory
const memory = new ConversationSummaryBufferMemory({
  llm: model,
  maxTokenLimit: 50,
  returnMessages: true,
});

// add data to memory
// await memory.saveContext({ input: "hi" }, { output: "Hello how can i help you" });
// await memory.saveContext(
//   { input: "My name is Nguyen Anh remember" },
//   { output: "Nice to see you Nguyen Anh, how can i help you today" }
// );

// define history with memory
// const history = await memory.loadMemoryVariables({});

// console.log("history:", history);

// get message
const messages = await memory.chatHistory.getMessages();
console.log("Messages:", messages);

//
// const previousSummary = "";
// const predictSummary = await memory.predictNewSummary(messages, previousSummary);
// console.log(JSON.stringify(predictSummary));

// define chain
const chain = new ConversationChain({
  llm: model,
  memory: memory,
  prompt: prompt,
});

const getAiResponse = async (text) => {
  try {
    const res1 = await chain.invoke({ input: "hi" });
    const res2 = await chain.invoke({ input: "My name is Nguyen Anh" });
    const res3 = await chain.invoke({ input: "Can u tell my name again" });
    return { res1, res2, res3 };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

console.log(await getAiResponse("Hi"));
memory.clear();
