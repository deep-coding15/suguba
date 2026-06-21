// connectDb.js
import mongoose from "mongoose";
import { MONGODB_URI } from "../configEnv.js"; // ← nouveau import

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI est introuvable dans le fichier .env");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connecté avec succès");
  } catch (error) {
    console.error("Erreur de connexion MongoDB :", error);
    process.exit(1);
  }
}

export default connectDB;