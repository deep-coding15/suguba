// ═══════════════════════════════════════════════════
// support.route.js
// ═══════════════════════════════════════════════════
import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  createSupportRequest,
  createContactMessage,
  getAllSupportRequests,
  getSupportPendingCount,
  updateSupportRequest
} from "../controllers/support.controller.js";

const supportRouter = Router();

// Client
supportRouter.post("/demande", auth, createSupportRequest);           // retour/échange (connecté)
supportRouter.post("/contact", createContactMessage);                  // message contact (public)

// Admin
supportRouter.get("/", auth, getAllSupportRequests);                   // liste toutes les demandes
supportRouter.get("/count", auth, getSupportPendingCount);             // compteur nouvelles demandes
supportRouter.put("/:id", auth, updateSupportRequest);                 // mettre à jour statut

export default supportRouter;