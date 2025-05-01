import express, { Request, Response } from "express";
import { fetchAndEmbedData } from "../consumers/embeddingConsumer";
import { logger } from "../utils/logger";
import { generateEmbeddingController } from "../controller/embeddingController";

const generateEmbeddingRouter = express.Router();

generateEmbeddingRouter.post(
  "/generate-embedding",
  generateEmbeddingController
);

export default generateEmbeddingRouter;
