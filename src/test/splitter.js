import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';


const splitter = new RecursiveCharacterTextSplitter(); // reduce amount of distraction like html tag?
/**
 * Recursively splitting text serves the purpose of trying to keep related pieces of text
 * next to each other
 */
const loader = new CheerioWebBaseLoader('https://i.am.ai/roadmap/'); // define loader for retrieval doc
const doc = await loader.load(); // load doc content
const splitedDoc = await splitter.splitDocuments(doc);

console.log(splitedDoc);