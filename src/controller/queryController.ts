import { Request, RequestHandler, Response } from "express";
import { logger } from "../utils/logger";

import { getQueryResponse } from "../services/aiQueryService";

export const queryController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({
      error: "Query Cannot be Empty",
    });
  }

  try {
    const response = await getQueryResponse(query);
    res.status(200).json({
      message: "Coginify Response",
      response,
    });
  } catch (err: any) {
    logger.error(`Error while fetching query response ${err}`);
    res.status(500).json({
      error: "Internal server error while fetching query response",
      details: err.message ?? err,
    });
  }
};
