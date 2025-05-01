import OpenAI from "openai";
import Bottleneck from "bottleneck";
import { CONFIG } from "../config";
import { chunkText } from "../utils/chunker";
import { insertEmbeddingChunk } from "./supabaseService";
import { logger } from "../utils/logger";

const openai = new OpenAI({ apiKey: CONFIG.OPENAI_API_KEY });

// 🔒 Rate limiter: 100ms between calls = 10 req/sec
const limiter = new Bottleneck({
  minTime: 100, // adjust based on your OpenAI rate limits
  maxConcurrent: 1,
});

export async function embedAndStoreText({
  text,
  source_type,
  source_id,
}: {
  text: string;
  source_type: string;
  source_id: string;
}) {
  try {
    const chunks = await chunkText(text);
    console.log("chunks", chunks);

    const results = await Promise.all(
      chunks.map((chunk, index) =>
        limiter.schedule(async () => {
          const response = await openai.embeddings.create({
            model: CONFIG.EMBEDDING_MODEL,
            input: chunk,
          });

          const embedding = response.data[0].embedding;

          const result = await insertEmbeddingChunk({
            chunk_index: index,
            chunk_text: chunk,
            embedding,
            source_type,
            source_id,
          });

          return result;
        })
      )
    );

    return results;
  } catch (error) {
    logger.error("Embedding process failed", error);
    throw new Error("Failed to process embeddings");
  }
}
