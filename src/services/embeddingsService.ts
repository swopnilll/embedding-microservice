import OpenAI from "openai";
import Bottleneck from "bottleneck";
import { CONFIG } from "../config";
import { chunkText } from "../utils/chunker";
import {
  bulkInsertEmbeddingChunks,
  insertEmbeddingChunk,
} from "./supabaseService";
import { logger } from "../utils/logger";

const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });

// 🔒 Rate limiter: 100ms between calls = 10 req/sec
const limiter = new Bottleneck({
  minTime: 110, // adjust based on your OpenAI rate limits
  maxConcurrent: 5,
});

export async function embedAndStoreText({
  text,
  project_id,
  task_id,
}: {
  text: string;
  project_id: number;
  task_id: number;
}) {
  try {
    const chunks = await chunkText(text);
    // console.log("chunks", chunks);

    const embeddingData = await Promise.all(
      chunks.map((chunk, index) =>
        limiter.schedule(async () => {
          const response = await openai.embeddings.create({
            model: CONFIG.EMBEDDING_MODEL,
            input: chunk,
          });

          const embedding = response.data[0].embedding;
          const formattedEmbedding = `[${embedding.join(",")}]`;

          return {
            chunk_index: index,
            chunk_text: chunk,
            embedding: formattedEmbedding,
            project_id,
            task_id,
          };
        })
      )
    );
    await bulkInsertEmbeddingChunks(embeddingData);
    return { message: "Embeddings stored", count: embeddingData.length };
  } catch (error) {
    logger.error("Embedding process failed", error);
    throw new Error("Failed to process embeddings");
  }
}
