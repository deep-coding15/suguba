import OrderModel from "../models/order.model.js";
import CartModel from "../models/cartProduct.model.js";
import ProductModel from "../models/product.model.js";
import SellerModel from "../models/seller.model.js";
import UserModel from "../models/user.model.js";
import HubModel from "../models/hub.model.js";
import { v4 as uuidv4 } from "uuid";

const COMMISSION_RATE = 0.10;

// ── Créer une commande depuis le panier ────────────────────────────────────
export async function createOrder(req, res) {
  try {
    const userId = req.userId;
    const {
      delivery_address, paymentMethod = "cash", note = "",
      pickupHub, deliveryType = "livraison"  // ✅ NOUVEAU
    } = req.body;

    // Validation selon le type de livraison
    if (deliveryType === "livraison" && !delivery_address) {
      return res.status(400).json({ error: true, success: false, message: "Adresse de livraison requise" });
    }
    if (deliveryType === "retrait-hub" && !pickupHub) {
      return res.status(400).json({ error: true, success: false, message: "Veuillez sélectionner un hub de retrait" });
    }

    const cartItems = await CartModel.find({ userId }).populate("productId");
    if (!cartItems.length) {
      return res.status(400).json({ error: true, success: false, message: "Votre panier est vide" });
    }

    const orderItems = [];
    let subTotalAmt = 0;
    let totalCommission = 0;

    for (const cartItem of cartItems) {
      const product = cartItem.productId;
      if (!product) continue;

      // ✅ Taux de commission selon le type de produit
      const commissionRate = product.isFeatures || product.isSpecialOffer ? 0.15 : COMMISSION_RATE;
      const subtotal = product.price * cartItem.quantity;
      const commission = Math.round(subtotal * commissionRate);
      const sellerRevenue = subtotal - commission;

      subTotalAmt += subtotal;
      totalCommission += commission;

      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId || null,
        sellerName: product.sellerName || "Suguba",
        productName: product.name,
        productImage: product.images?.[0] || "",
        price: product.price,
        quantity: cartItem.quantity,
        size: cartItem.size || "",
        subtotal,
        commission,
        commissionRate: commissionRate * 100,
        sellerRevenue,
        status: "en-attente"
      });
    }

    // Livraison gratuite si > 20000 Fcfa OU retrait en hub
    const deliveryFee = (subTotalAmt > 20000 || deliveryType === "retrait-hub") ? 0 : 1000;
    const totalAmt = subTotalAmt + deliveryFee;

    // ✅ Fenêtre d'annulation : 2h après création
    const canCancelUntil = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const order = new OrderModel({
      userId,
      orderId: `SUG-${uuidv4().slice(0, 8).toUpperCase()}`,
      items: orderItems,
      delivery_address: deliveryType === "livraison" ? delivery_address : null,
      pickupHub: deliveryType === "retrait-hub" ? pickupHub : null,
      deliveryType,
      paymentMethod, note,
      subTotalAmt, deliveryFee, totalAmt, totalCommission,
      paymentStatus: "en-attente",
      status: "en-attente",
      canCancelUntil
    });

    await order.save();

    // Mettre à jour stocks et stats vendeurs
    for (const item of orderItems) {
      await ProductModel.findByIdAndUpdate(item.productId, {
        $inc: { countInStock: -item.quantity, sales: item.quantity }
      });
      if (item.sellerId) {
        await SellerModel.findOneAndUpdate(
          { userId: item.sellerId },
          {
            $inc: {
              totalRevenue: item.subtotal,
              totalCommission: item.commission,
              totalNet: item.sellerRevenue,
              totalOrders: 1,
              totalSales: item.quantity
            }
          }
        );
      }
    }

    await CartModel.deleteMany({ userId });
    await UserModel.findByIdAndUpdate(userId, {
      shopping_cart: [],
      $push: { orderHistory: order._id }
    });

    return res.status(200).json({
      success: true, error: false,
      message: "Commande passée avec succès !",
      data: order
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── ✅ NOUVEAU — Annuler une commande (client, fenêtre de 2h) ──────────────
export async function cancelOrder(req, res) {
  try {
    const userId = req.userId;
    const { cancelReason } = req.body;
    const order = await OrderModel.findById(req.params.id);

    if (!order) return res.status(404).json({ error: true, success: false, message: "Commande introuvable" });
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: true, success: false, message: "Non autorisé" });
    }
    if (order.status === "annulé") {
      return res.status(400).json({ error: true, success: false, message: "Commande déjà annulée" });
    }
    if (order.status === "livré") {
      return res.status(400).json({ error: true, success: false, message: "Impossible d'annuler une commande déjà livrée" });
    }

    // ✅ Vérifier la fenêtre d'annulation
    const now = new Date();
    if (order.canCancelUntil && now > order.canCancelUntil && order.status !== "en-attente") {
      return res.status(400).json({
        error: true, success: false,
        message: "Le délai d'annulation de 2h est dépassé. Veuillez contacter le support."
      });
    }

    // Restaurer les stocks
    for (const item of order.items) {
      await ProductModel.findByIdAndUpdate(item.productId, {
        $inc: { countInStock: item.quantity, sales: -item.quantity }
      });
      if (item.sellerId) {
        await SellerModel.findOneAndUpdate(
          { userId: item.sellerId },
          {
            $inc: {
              totalRevenue: -item.subtotal,
              totalCommission: -item.commission,
              totalNet: -item.sellerRevenue,
              totalOrders: -1,
              totalSales: -item.quantity
            }
          }
        );
      }
    }

    order.status = "annulé";
    order.cancelledAt = now;
    order.cancelReason = cancelReason || "Annulation client";
    order.items.forEach(item => { item.status = "annulé"; });
    await order.save();

    return res.status(200).json({
      success: true, error: false,
      message: "Commande annulée avec succès."
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Commandes d'un client ──────────────────────────────────────────────────
export async function getMyOrders(req, res) {
  try {
    const userId = req.userId;
    const orders = await OrderModel.find({ userId })
      .populate("delivery_address")
      .populate("pickupHub", "name address city phone hours")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, error: false, data: orders });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Détail d'une commande ──────────────────────────────────────────────────
export async function getOrderById(req, res) {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate("userId", "name email")
      .populate("delivery_address")
      .populate("pickupHub", "name address city phone hours");
    if (!order) return res.status(404).json({ error: true, success: false, message: "Commande introuvable" });
    return res.status(200).json({ success: true, error: false, data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Toutes les commandes (admin) ───────────────────────────────────────────
export async function getAllOrders(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;
    const status = req.query.status;
    const filter = status && status !== "all" ? { status } : {};
    const total = await OrderModel.countDocuments(filter);
    const orders = await OrderModel.find(filter)
      .populate("userId", "name email")
      .populate("delivery_address")
      .populate("pickupHub", "name city")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);
    return res.status(200).json({
      success: true, error: false, data: orders,
      totalPages: Math.ceil(total / perPage), total
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Mettre à jour le statut d'une commande (admin) ─────────────────────────
export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const order = await OrderModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
    return res.status(200).json({ success: true, error: false, message: "Statut mis à jour", data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}




{/*import OrderModel from "../models/order.model.js";
import CartModel from "../models/cartProduct.model.js";
import ProductModel from "../models/product.model.js";
import SellerModel from "../models/seller.model.js";
import UserModel from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";

const COMMISSION_RATE = 0.10; // 10%

// Créer une commande depuis le panier
export async function createOrder(req, res) {
  try {
    const userId = req.userId;
    const { delivery_address, paymentMethod = "cash", note = "" } = req.body;

    if (!delivery_address) {
      return res.status(400).json({ error: true, success: false, message: "Adresse de livraison requise" });
    }

    // Récupérer le panier
    const cartItems = await CartModel.find({ userId }).populate("productId");
    if (!cartItems.length) {
      return res.status(400).json({ error: true, success: false, message: "Votre panier est vide" });
    }

    // Construire les items de la commande
    const orderItems = [];
    let subTotalAmt = 0;
    let totalCommission = 0;

    for (const cartItem of cartItems) {
      const product = cartItem.productId;
      if (!product) continue;

      const subtotal = product.price * cartItem.quantity;
      const commission = Math.round(subtotal * COMMISSION_RATE);
      const sellerRevenue = subtotal - commission;

      subTotalAmt += subtotal;
      totalCommission += commission;

      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId || null,
        sellerName: product.sellerName || "Suguba",
        productName: product.name,
        productImage: product.images?.[0] || "",
        price: product.price,
        quantity: cartItem.quantity,
        size: cartItem.size || "",
        subtotal,
        commission,
        sellerRevenue,
        status: "en-attente"
      });
    }

    const deliveryFee = subTotalAmt > 20000 ? 0 : 1000;
    const totalAmt = subTotalAmt + deliveryFee;

    const order = new OrderModel({
      userId,
      orderId: `SUG-${uuidv4().slice(0, 8).toUpperCase()}`,
      items: orderItems,
      delivery_address,
      paymentMethod, note,
      subTotalAmt, deliveryFee, totalAmt, totalCommission,
      paymentStatus: "en-attente",
      status: "en-attente"
    });

    await order.save();

    // Mettre à jour les stats vendeurs et stocks
    for (const item of orderItems) {
      // Décrémenter le stock
      await ProductModel.findByIdAndUpdate(item.productId, {
        $inc: { countInStock: -item.quantity, sales: item.quantity }
      });

      // Mettre à jour les revenus du vendeur si produit vendeur
      if (item.sellerId) {
        await SellerModel.findOneAndUpdate(
          { userId: item.sellerId },
          {
            $inc: {
              totalRevenue: item.subtotal,
              totalCommission: item.commission,
              totalNet: item.sellerRevenue,
              totalOrders: 1,
              totalSales: item.quantity
            }
          }
        );
      }
    }

    // Vider le panier
    await CartModel.deleteMany({ userId });
    await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });

    // Ajouter la commande à l'historique
    await UserModel.findByIdAndUpdate(userId, {
      $push: { orderHistory: order._id }
    });

    return res.status(200).json({
      success: true, error: false,
      message: "Commande passée avec succès !",
      data: order
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Commandes d'un client
export async function getMyOrders(req, res) {
  try {
    const userId = req.userId;
    const orders = await OrderModel.find({ userId })
      .populate("delivery_address")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, error: false, data: orders });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Détail d'une commande
export async function getOrderById(req, res) {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate("userId", "name email")
      .populate("delivery_address");
    if (!order) return res.status(404).json({ error: true, success: false, message: "Commande introuvable" });
    return res.status(200).json({ success: true, error: false, data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Toutes les commandes (admin)
export async function getAllOrders(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;
    const status = req.query.status;

    const filter = status && status !== "all" ? { status } : {};
    const total = await OrderModel.countDocuments(filter);

    const orders = await OrderModel.find(filter)
      .populate("userId", "name email")
      .populate("delivery_address")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.status(200).json({
      success: true, error: false, data: orders,
      totalPages: Math.ceil(total / perPage), total
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Mettre à jour le statut d'une commande (admin)
export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const order = await OrderModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
    return res.status(200).json({ success: true, error: false, message: "Statut mis à jour", data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}*/}