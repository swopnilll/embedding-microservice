import { Pool } from "pg";
import { CONFIG } from "../config";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger";

import sql from "../db/db";
import { jsonToText } from "../utils/jsonTotext";

export async function insertEmbeddingChunk({
  chunk_index,
  chunk_text,
  embedding,
  project_id,
  task_id,
}: {
  chunk_index: number;
  chunk_text: string;
  embedding: string;
  project_id: number;
  task_id: number;
}) {
  try {
    await sql`
      INSERT INTO knowledge_base (
       task_id, project_id, chunk_index, chunk_text, embedding
      ) VALUES (
       ${task_id}, ${project_id}, ${chunk_index}, ${chunk_text}, ${embedding}
      )
    `;
    return { chunk_index };
  } catch (error) {
    logger.error("Database insert failed", error);
    throw new Error("Failed to insert embedding to DB");
  }
}

export async function fetchDataFromDatabase(
  ticketId: number,
  projectId: number
) {
  try {
    // Fetch project
    const projectRes =
      await sql`SELECT * from "Project" where project_id=${projectId}`;
    if (projectRes?.length == 0) throw new Error("Project not found.");

    // Fetch ticket
    const ticketRes =
      await sql`SELECT * from "Ticket" where ticket_id=${ticketId}`;
    if (ticketRes?.length == 0) throw new Error("Ticket not found.");

    const combinedText = jsonToText(projectRes[0]) + jsonToText(ticketRes[0]);

    logger.info(
      `Fetched project ${projectId} and ticket ${ticketId} successfully.`
    );
    return combinedText;
  } catch (error) {
    logger.error("Error in fetching data from database", error);
    throw new Error("Error in fetching data from database");
  }
}

export async function bulkInsertEmbeddingChunks(
  chunks: {
    chunk_index: number;
    chunk_text: string;
    embedding: string;
    project_id: number;
    task_id: number;
  }[]
) {
  if (chunks.length === 0) return;

  const values = chunks.map(
    ({ task_id, project_id, chunk_index, chunk_text, embedding }) => [
      task_id,
      project_id,
      chunk_index,
      chunk_text,
      embedding,
    ]
  );

  try {
    await sql`
      INSERT INTO knowledge_base (
        task_id, project_id, chunk_index, chunk_text, embedding
      ) VALUES ${sql(values)}
    `;
    return { inserted: chunks.length };
  } catch (error) {
    logger.error("Bulk insert failed", error);
    throw new Error("Failed to insert embeddings");
  }
}
