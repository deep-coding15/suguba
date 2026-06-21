import SellerModel from "../models/seller.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import OrderModel from "../models/order.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

// Devenir vendeur
export async function becomeSeller(req, res) {
  try {
    const userId = req.userId;
    const { shopName, shopDescription, phone, address } = req.body;

    if (!shopName) {
      return res.status(400).json({ error: true, success: false, message: "Le nom de la boutique est requis" });
    }

    const existing = await SellerModel.findOne({ userId });
    if (existing) {
      return res.status(400).json({ error: true, success: false, message: "Vous êtes déjà vendeur" });
    }

    const seller = new SellerModel({
      userId, shopName, shopDescription, phone, address,
      status: "active", commissionRate: 10
    });
    await seller.save();

    await UserModel.findByIdAndUpdate(userId, {
      role: "Seller", isSeller: true, sellerId: seller._id
    });

    return res.status(200).json({
      success: true, error: false,
      message: "Félicitations ! Votre espace vendeur est activé.",
      seller
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Profil vendeur
export async function getSellerProfile(req, res) {
  try {
    const userId = req.userId;
    const seller = await SellerModel.findOne({ userId }).populate("userId", "name email avatar");
    if (!seller) {
      return res.status(404).json({ error: true, success: false, message: "Profil vendeur introuvable" });
    }
    return res.status(200).json({ success: true, error: false, data: seller });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Mettre à jour le profil vendeur
export async function updateSellerProfile(req, res) {
  try {
    const userId = req.userId;
    const { shopLogo, shopName, shopDescription, phone, address, bankInfo } = req.body;

    const seller = await SellerModel.findOneAndUpdate(
      { userId },
      { shopLogo ,shopName, shopDescription, phone, address, bankInfo },
      { new: true }
    );

    return res.status(200).json({ success: true, error: false, message: "Profil mis à jour", data: seller });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Dashboard vendeur — statistiques
export async function getSellerDashboard(req, res) {
  try {
    const userId = req.userId;
    const seller = await SellerModel.findOne({ userId });
    if (!seller) {
      return res.status(404).json({ error: true, success: false, message: "Vendeur introuvable" });
    }

    // Produits du vendeur
    const totalProducts = await ProductModel.countDocuments({ sellerId: userId });
    const outOfStock = await ProductModel.countDocuments({ sellerId: userId, countInStock: 0 });

    // Commandes du vendeur (items où sellerId = userId)
    const orders = await OrderModel.find({ "items.sellerId": userId });

    // Calcul des stats
    let totalRevenue = 0, totalCommission = 0, totalNet = 0, totalSales = 0;
    const recentOrders = [];

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.sellerId?.toString() === userId.toString()) {
          totalRevenue += item.subtotal || 0;
          totalCommission += item.commission || 0;
          totalNet += item.sellerRevenue || 0;
          totalSales += item.quantity || 0;
        }
      });
      recentOrders.push(order);
    });

    // Commandes des 30 derniers jours
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentOrdersCount = orders.filter(o => new Date(o.createdAt) > thirtyDaysAgo).length;

    // Graphique revenus par mois (6 derniers mois)
    const revenueByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString("fr-FR", { month: "short", year: "2-digit" });
      const monthRevenue = orders
        .filter(o => {
          const d = new Date(o.createdAt);
          return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
        })
        .reduce((sum, o) => {
          return sum + o.items
            .filter(it => it.sellerId?.toString() === userId.toString())
            .reduce((s, it) => s + (it.sellerRevenue || 0), 0);
        }, 0);
      revenueByMonth.push({ month, revenue: monthRevenue });
    }

    return res.status(200).json({
      success: true, error: false,
      data: {
        seller,
        stats: {
          totalProducts, outOfStock,
          totalRevenue, totalCommission, totalNet,
          totalSales, totalOrders: orders.length,
          recentOrdersCount, revenueByMonth
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Produits du vendeur
export async function getSellerProducts(req, res) {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const total = await ProductModel.countDocuments({ sellerId: userId });
    const products = await ProductModel.find({ sellerId: userId })
      .populate("category")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.status(200).json({
      success: true, error: false,
      produits: products,
      totalPages: Math.ceil(total / perPage),
      total
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Commandes reçues par le vendeur
export async function getSellerOrders(req, res) {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const status = req.query.status;

    const filter = { "items.sellerId": userId };
    if (status && status !== "all") filter["items.status"] = status;

    const orders = await OrderModel.find(filter)
      .populate("userId", "name email")
      .populate("delivery_address")
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const total = await OrderModel.countDocuments(filter);

    // Filtrer pour ne montrer que les items du vendeur
    const filteredOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.filter(item => item.sellerId?.toString() === userId.toString())
    }));

    return res.status(200).json({
      success: true, error: false,
      data: filteredOrders,
      totalPages: Math.ceil(total / perPage), total
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Mettre à jour le statut d'un item de commande
export async function updateOrderItemStatus(req, res) {
  try {
    const userId = req.userId;
    const { orderId, itemId, status } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ error: true, success: false, message: "Commande introuvable" });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ error: true, success: false, message: "Produit introuvable dans la commande" });

    if (item.sellerId?.toString() !== userId.toString()) {
      return res.status(403).json({ error: true, success: false, message: "Non autorisé" });
    }

    item.status = status;
    await order.save();

    return res.status(200).json({ success: true, error: false, message: "Statut mis à jour" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Upload logo/bannière boutique
export async function uploadSellerImage(req, res) {
  try {
    const image = req.files;
    const imagesArr = [];
    const options = { use_filename: true, unique_filename: false, overwrite: false };

    for (const img of image) {
      try {
        const result = await cloudinary.uploader.upload(img.path, options);
        imagesArr.push(result.secure_url);
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        if (fs.existsSync(img.path)) fs.unlinkSync(img.path);
      }
    }

    return res.status(200).json({ success: true, error: false, images: imagesArr });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Liste tous les vendeurs (admin)
export async function getAllSellers(req, res) {
  try {
    const sellers = await SellerModel.find()
      .populate("userId", "name email avatar status")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, error: false, data: sellers });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Suspendre/activer un vendeur (admin)
export async function updateSellerStatus(req, res) {
  try {
    const { sellerId, status } = req.body;
    const seller = await SellerModel.findByIdAndUpdate(sellerId, { status }, { new: true });
    if (status === "suspended") {
      await UserModel.findByIdAndUpdate(seller.userId, { status: "Suspended" });
    } else if (status === "active") {
      await UserModel.findByIdAndUpdate(seller.userId, { status: "Active" });
    }
    return res.status(200).json({ success: true, error: false, message: "Statut vendeur mis à jour", data: seller });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}