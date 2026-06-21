import mongoose from "mongoose";

// ── Demandes support (retour, échange, message contact) ────────────────────
const supportRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["return", "exchange", "contact"],
    required: true
  },
  // Infos client
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  clientName: { type: String, default: "" },
  clientEmail: { type: String, default: "" },
  clientPhone: { type: String, default: "" },

  // Pour retour/échange
  orderId: { type: String, default: "" },          // numéro commande ex: SUG-XXXX
  orderMongoId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
  productId: { type: String, default: "" },        // ID mongo du produit
  productName: { type: String, default: "" },
  productImage: { type: String, default: "" },
  reason: { type: String, default: "" },
  newSize: { type: String, default: "" },          // pour échange taille/couleur
  details: { type: String, default: "" },          // description libre

  // Pour message contact
  subject: { type: String, default: "" },
  message: { type: String, default: "" },

  // Statut traitement admin
  status: {
    type: String,
    enum: ["nouveau", "en-cours", "résolu", "rejeté"],
    default: "nouveau"
  },
  adminNote: { type: String, default: "" },
  resolvedAt: { type: Date, default: null },
}, { timestamps: true });

const SupportRequestModel = mongoose.model("SupportRequest", supportRequestSchema);
export default SupportRequestModel;