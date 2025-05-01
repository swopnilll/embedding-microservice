// db.js
import postgres from "postgres";
import { CONFIG } from "../config";

const connectionString = CONFIG.DATABASE_URL;
const sql = postgres(connectionString);

export default sql;
