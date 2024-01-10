import { OpenAI, ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { Document } from '@langchain/core/documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import dotenv from 'dotenv';

dotenv.config(); // config dotenv

const OPENAI_API = process.env.OPENAI_KEY;
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: OPENAI_API
}); // openai's embedding

// define chatModel with OpenAI API
const chatModel = new ChatOpenAI({
  openAIApiKey: OPENAI_API,
});

// prompt
const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are good at writing formally'],
  ['user', '{input}'],
]);

const promptForRetrieval = ChatPromptTemplate.fromTemplate(`Answer following question based only on the provided content: <context>{context}</context> Question: {input}`);

// string output parsers
const outputParser = new StringOutputParser();

// retrieval
const splitter = new RecursiveCharacterTextSplitter(); // reduce amount of distraction like html tag?
const loader = new CheerioWebBaseLoader('https://i.am.ai/roadmap/'); // define loader for retrieval doc
const doc = await loader.load(); // load doc content
const splitedDoc = await splitter.splitDocuments(doc);

// loaded document into vectorstore
const vectorstore = await MemoryVectorStore.fromDocuments(splitedDoc, embeddings); // preparing raw document using the embedding model
/** Having indexed in vectorstore, now creating a retrieval chain.
 *  This will take an incoming question, look up relevant document
 *  Then pass documents along with the original question into an LLM
 *  and ask it to answer  */
const documentChain = await createStuffDocumentsChain({
  llm: chatModel,
  prompt: promptForRetrieval,
});

// setup retrieval
const retriever = vectorstore.asRetriever();
const retrievalChain = await createRetrievalChain({
  combineDocsChain: documentChain,
  retriever,
});

const chain = prompt.pipe(chatModel).pipe(outputParser); // combine prompt and chatModel

// get response function
const getLLMResponse = async (text) => {
  try {
    // const result = await chain.invoke({ input: text });
    const result = await retrievalChain.invoke({
      input: text,
    });
    return result.answer;
  } catch (error) {
    throw new Error(error.message);
  }
};

// console.log(splitedDoc[0].pageContent.length);
console.log('Answer:', await getLLMResponse('Talk about road map to AI with this document'));
