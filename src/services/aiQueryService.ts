import { logger } from "../utils/logger";
import { initVectorStore } from "./vectorStore";
import { ChatOpenAI } from "@langchain/openai";
import { CONFIG } from "../config";

export async function getQueryResponse(query: string) {
  try {
    const vectorStore = await initVectorStore();

    const results = await vectorStore.similaritySearch(query, 5);

    const model = new ChatOpenAI({
      openAIApiKey: CONFIG.OPENAI_API_KEY,
      temperature: 0.7,
      model: "gpt-4o",
      streaming: true,
    });

    const context = results.map((r) => r.pageContent).join("\n");

    const messages = [
      {
        role: "system",
        content: "You are a helpful project management assistant.",
      },
      {
        role: "user",
        content: `
            Use the following context to answer the user's question.

            Context:
            ${context}

            Question:
            ${query}
          `,
      },
    ];

    let finalAnswer = "";
    let fullResponse = "";

    const stream = await model.stream(messages);

    for await (const chunk of stream) {
      const content = chunk.content;
      if (content) {
        finalAnswer += content;
        fullResponse += content;
      }
    }

    return fullResponse;
  } catch (error) {
    logger.error("Error during processing of similary search", error);
    throw error;
  }
}
