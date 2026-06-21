// configEnv.js
import dotenv from "dotenv";
import path from "path";

// Forcer Node à lire ton vrai .env
dotenv.config({ path: path.resolve("./.env") });

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;