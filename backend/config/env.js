import { config } from "dotenv";
import process from "node:process";

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const { NODE_ENV, PORT, DB_URI, JWT_SECRET, JWT_EXPIRES_IN, MAX_FILE_SIZE } = process.env;