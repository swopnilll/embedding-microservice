import express from "express";
import { Request, Response, NextFunction } from "express";
// import { startEmbeddingConsumer } from "./consumers/embeddingConsumer";
import { logger } from "./utils/logger";

import generateEmbeddingRouter from "./routes/generateEmbeddingRoutes";

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/health", (_, res) => {
  try {
    res.status(200).send("✅ Embedding microservice is healthy.");
  } catch (error) {
    logger.error("Health check failed", error);
    res.status(500).send("Service unhealthy");
  }
});

app.use(express.json());

app.use("/api", generateEmbeddingRouter);

app.listen(PORT, () => {
  logger.info(`Embedding microservice running on port ${PORT}`);
  //   startEmbeddingConsumer();
});
