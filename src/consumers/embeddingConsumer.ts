// import {
//   SQSClient,
//   ReceiveMessageCommand,
//   DeleteMessageCommand,
// } from "@aws-sdk/client-sqs";
import { CONFIG } from "../config";
import express, { Request, Response } from "express";
import { embedAndStoreText } from "../services/embeddingsService";
import { logger } from "../utils/logger";
import { fetchDataFromDatabase } from "../services/supabaseService";

// TODO: replace this fetching logic with Mail queue logic . Below is the example code commented out.
async function fetchData(taskId: number, ProjectId: number) {
  //add logic to fetch data from supabase and convert it to string
  //first fetch project information and then tasks information
  //convert the json to text

  try {
    const combinedText = await fetchDataFromDatabase(taskId, ProjectId);
    return combinedText;
  } catch (err) {
    logger.error(`Error while fetching the data ${err}`);
    throw new Error("Error in fetching data from database");
  }
}

export async function fetchAndEmbedData(taskId: number, ProjectId: number) {
  try {
    const text = await fetchData(taskId, ProjectId);
    const embeddings = await embedAndStoreText({
      text: text,
      project_id: ProjectId,
      task_id: taskId,
    });
    return embeddings;
  } catch (err) {
    logger.error(`Error while fetching and embedding the data ${err}`);
    throw new Error("Error in fetching and embedding the data.");
  }
}

//Example code of subscribing to amazon sqs
// export async function startEmbeddingConsumer() {
//   const client = new SQSClient({ region: CONFIG.AWS_REGION });

//   setInterval(async () => {
//     try {
//       const command = new ReceiveMessageCommand({
//         QueueUrl: CONFIG.SQS_QUEUE_URL,
//         MaxNumberOfMessages: 5,
//         WaitTimeSeconds: 10,
//       });

//       const response = await client.send(command);
//       if (!response.Messages) return;

//       for (const msg of response.Messages) {
//         try {
//           const { type, id } = JSON.parse(msg.Body!);
//           const text = await fetchData(type, id);
//           await embedAndStoreText({ text, source_type: type, source_id: id });

//           await client.send(
//             new DeleteMessageCommand({
//               QueueUrl: CONFIG.SQS_QUEUE_URL,
//               ReceiptHandle: msg.ReceiptHandle!,
//             })
//           );

//           logger.info(`Processed ${type} ${id}`);
//         } catch (err) {
//           logger.error("Failed to process SQS message", err);
//         }
//       }
//     } catch (err) {
//       logger.error("Failed to poll SQS", err);
//     }
//   }, 5000);
// }
