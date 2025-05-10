import { ProcessErrorArgs, ServiceBusClient } from "@azure/service-bus";
import { logger } from "../utils/logger";
import { CONFIG } from "../config";
import { fetchAndEmbedData } from "./embeddingConsumer";

const connectionString = CONFIG.SERVICE_BUS_CONNECTION_STRING;
const queueName = "embedding-jobs";
const serviceBusClient = new ServiceBusClient(connectionString);

// Function to test if the connection to Azure Service Bus is successful
const testConnection = async () => {
  try {
    // Attempt to get queue runtime properties (check if connection is live)
    const receiver = serviceBusClient.createReceiver(queueName, {
      receiveMode: "peekLock",
    });

    // Try to peek a message to ensure the queue is accessible
    await receiver.peekMessages(1);

    // Log success if no errors occur
    logger.info(`Successfully connected to Azure Service Bus and the queue '${queueName}' is ready for message consumption.`);
  } catch (error) {
    // Log failure if an error occurs while connecting or peeking messages
    if (error instanceof Error) {
      logger.error(`Error connecting to Azure Service Bus: ${error.message}`);
    } else {
      logger.error("Error connecting to Azure Service Bus: Unknown error");
    }
  }
};

// Call the testConnection function
testConnection();

export interface EmbeddingJobPayload {
  projectId: number;
  taskId: number;
}

export const startEmbeddingConsumer = async () => {
  const receiver = serviceBusClient.createReceiver(queueName, {
    receiveMode: "peekLock",
  });

  const messageHandler = async (message: any) => {
    try {
      const payload = message.body as EmbeddingJobPayload;

      logger.info(`Received embedding job: projectId=${payload.projectId}, taskId=${payload.taskId}`);

      await fetchAndEmbedData(payload.taskId, payload.projectId);

      await receiver.completeMessage(message); // Acknowledge message
    } catch (error) {
      logger.error("Error processing embedding job:", error);
      await receiver.abandonMessage(message); // Release message back to queue
    }
  };

  const errorHandler = async (args: ProcessErrorArgs): Promise<void> => {
    logger.error(`Error in Azure Service Bus receiver: ${args.error.message}`, args.error);
  };

  receiver.subscribe(
    {
      processMessage: messageHandler,
      processError: errorHandler,
    },
    {
      autoCompleteMessages: false,
    }
  );

  logger.info("Embedding consumer started and listening to queue...");
};

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down Service Bus client...");
  await serviceBusClient.close();
  process.exit(0);
});
