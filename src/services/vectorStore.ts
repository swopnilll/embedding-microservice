import { OpenAIEmbeddings } from "@langchain/openai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { OpenAI } from "@langchain/openai";
import { CONFIG } from "../config";
import { logger } from "../utils/logger";
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: CONFIG.OPENAI_API_KEY,
  model: CONFIG.EMBEDDING_MODEL,
});

export async function initVectorStore() {
  try {
    const vectorStore = await PGVectorStore.initialize(embeddings, {
      postgresConnectionOptions: {
        connectionString: CONFIG.DATABASE_URL,
      },
      tableName: "knowledge_base",
      columns: {
        idColumnName: "id",
        vectorColumnName: "embedding",
        contentColumnName: "chunk_text",
      },
    });
    logger.info("PGVectorStore initialized successfully.");
    return vectorStore;
  } catch (err) {
    logger.error("Failed to initialize PGVectorStore:", err);
    throw err;
  }
}
