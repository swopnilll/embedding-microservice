import express from "express";
import { logger } from "./utils/logger";

import generateEmbeddingRouter from "./routes/generateEmbeddingRoutes";
import queryRouter from "./routes/queryRoutes";
import { startEmbeddingConsumer } from "./consumers/consumer";

const app = express();

const PORT = process.env.PORT || 3002;

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

app.use("/api", queryRouter);

app.listen(PORT, () => {
  logger.info(`Embedding microservice running on port ${PORT}`);
   startEmbeddingConsumer();
});
