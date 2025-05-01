import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  DATABASE_URL: process.env.DATABASE_URL!,
  SQS_QUEUE_URL: process.env.SQS_QUEUE_URL!,
  AWS_REGION: process.env.AWS_REGION || "ap-southeast-2",
  EMBEDDING_MODEL: "text-embedding-3-small",
};