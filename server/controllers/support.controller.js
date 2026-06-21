import SupportRequestModel from "../models/supportRequest.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";

// ── Client : créer une demande retour/échange ──────────────────────────────
export async function createSupportRequest(req, res) {
  try {
    const userId = req.userId;
    const {
      type, orderId, productId, productName, productImage,
      reason, newSize, details
    } = req.body;

    if (!type || !orderId || !reason || !details) {
      return res.status(400).json({
        error: true, success: false,
        message: "Type, numéro de commande, raison et détails sont requis"
      });
    }

    // Trouver la commande pour récupérer les infos
    const order = await OrderModel.findOne({ orderId });
    const user = await UserModel.findById(userId).select("name email mobile");

    // Trouver le produit dans la commande si productId fourni
    let pName = productName, pImage = productImage;
    if (order && productId) {
      const item = order.items.find(i => i.productId?.toString() === productId);
      if (item) {
        pName = pName || item.productName;
        pImage = pImage || item.productImage;
      }
    }

    const request = new SupportRequestModel({
      type,
      userId,
      clientName: user?.name || "",
      clientEmail: user?.email || "",
      clientPhone: user?.mobile?.toString() || "",
      orderId,
      orderMongoId: order?._id || null,
      productId: productId || "",
      productName: pName || "",
      productImage: pImage || "",
      reason,
      newSize: newSize || "",
      details,
      status: "nouveau"
    });

    await request.save();

    return res.status(200).json({
      success: true, error: false,
      message: "Demande envoyée avec succès. Notre équipe vous contactera sous 24–48h.",
      data: { ref: request._id.toString().slice(-8).toUpperCase() }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Client : créer un message contact ─────────────────────────────────────
export async function createContactMessage(req, res) {
  try {
    const { clientName, clientEmail, clientPhone, subject, message } = req.body;
    const userId = req.userId || null;

    if (!clientName || !message || !subject) {
      return res.status(400).json({
        error: true, success: false,
        message: "Nom, objet et message sont requis"
      });
    }

    const request = new SupportRequestModel({
      type: "contact",
      userId,
      clientName,
      clientEmail: clientEmail || "",
      clientPhone: clientPhone || "",
      subject,
      message,
      status: "nouveau"
    });

    await request.save();

    return res.status(200).json({
      success: true, error: false,
      message: "Message envoyé ! Notre équipe vous répond sous 24h.",
      data: { ref: request._id.toString().slice(-8).toUpperCase() }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Admin : liste toutes les demandes (retour + échange + contact) ─────────
export async function getAllSupportRequests(req, res) {
  try {
    const { type, status, page = 1, perPage = 50 } = req.query;
    const filter = {};
    if (type && type !== "all") filter.type = type;
    if (status && status !== "all") filter.status = status;

    const total = await SupportRequestModel.countDocuments(filter);
    const requests = await SupportRequestModel.find(filter)
      .populate("userId", "name email avatar")
      .populate("orderMongoId", "orderId totalAmt status")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.status(200).json({
      success: true, error: false,
      data: requests, total,
      totalPages: Math.ceil(total / perPage)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Admin : compteur demandes en attente ───────────────────────────────────
export async function getSupportPendingCount(req, res) {
  try {
    const count = await SupportRequestModel.countDocuments({ status: "nouveau" });
    return res.status(200).json({ success: true, error: false, count });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Admin : mettre à jour le statut d'une demande ─────────────────────────
export async function updateSupportRequest(req, res) {
  try {
    const { status, adminNote } = req.body;
    const request = await SupportRequestModel.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNote: adminNote || "",
        resolvedAt: ["résolu", "rejeté"].includes(status) ? new Date() : null
      },
      { new: true }
    );
    if (!request) return res.status(404).json({ error: true, success: false, message: "Demande introuvable" });
    return res.status(200).json({ success: true, error: false, message: "Statut mis à jour", data: request });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}