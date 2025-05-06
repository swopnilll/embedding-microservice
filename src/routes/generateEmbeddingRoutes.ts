import express from "express";
import { generateEmbeddingController } from "../controller/embeddingController";

const generateEmbeddingRouter = express.Router();

generateEmbeddingRouter.post(
  "/generate-embedding",
  generateEmbeddingController
);

export default generateEmbeddingRouter;
