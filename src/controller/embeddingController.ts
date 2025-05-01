import { fetchAndEmbedData } from "../consumers/embeddingConsumer";
import { Request, RequestHandler, Response } from "express";
import { logger } from "../utils/logger";

export const generateEmbeddingController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { taskId, projectId } = req.body;
  if (!projectId || !taskId) {
    res.status(400).json({
      error: "Both 'projectId' and 'ticketId' are required as numbers.",
    });
  }

  try {
    const embeddingIds = await fetchAndEmbedData(taskId, projectId);
    res.status(200).json({
      message: "Embedding successfully generated and stored.",
      embeddingIds,
    });
  } catch (err: any) {
    logger.error(`Error while fetching and embediing the data ${err}`);
    res.status(500).json({
      error: "Internal server error while generating embeddings.",
      details: err.message ?? err,
    });
  }
};
