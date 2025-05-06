import express from "express";
import { queryController } from "../controller/queryController";

const queryRouter = express.Router();

queryRouter.post("/askIntellecta", queryController);

export default queryRouter;
