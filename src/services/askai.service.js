import OpenAI from "openai";
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { ConversationSummaryBufferMemory } from "langchain/memory";
import dotenv from "dotenv";
import { ConversationChain } from "langchain/chains";
import { StringOutputParser } from "@langchain/core/output_parsers";

// dotenv config
dotenv.config();

const intChain = async () => {
  // define model
  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_KEY,
  });

  // prompt for generate
  const promptChat = ChatPromptTemplate.fromMessages([
    // prompt
    SystemMessagePromptTemplate.fromTemplate(
      "Give answer formally to user if there is based on given conversation. or else thought to answer"
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

  // memory for chat
  const memory = new ConversationSummaryBufferMemory({
    llm: model,
    maxTokenLimit: 50,
    returnMessages: true,
  });

  // output parser
  const output_parser = new StringOutputParser();

  // chain prompt and model
  const chain = new ConversationChain({
    llm: model,
    memory: memory,
    prompt: promptChat,
    outputParser: output_parser
  });

  return chain;
};

const chain = await intChain(); // define outside function to make this static

export const askAIService = async (content, role) => {
  /** Using OpenAi lib for calling response from GPT
   * @param content
   * @param role
   * using langchainjs can obtain ability of memorizing message list
   */

  try {
    const getAiResponse = async (text) => {
      const { response } = await chain.invoke({ input: text });
      return { content: response, role: "assisstant" };
    };
    return await getAiResponse(content);
  } catch (error) {
    console.log("Message from askAI service", error.message);
    throw new Error(error.message);
  }
};
