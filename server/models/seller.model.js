import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  shopName: { type: String, required: true },
  shopDescription: { type: String, default: "" },
  shopLogo: { type: String, default: "" },
  shopBanner: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  status: { type: String, enum: ["pending", "active", "suspended"], default: "active" },
  commissionRate: { type: Number, default: 10 }, // % que Suguba prend
  totalRevenue: { type: Number, default: 0 },     // revenus bruts totaux
  totalCommission: { type: Number, default: 0 },  // total versé à Suguba
  totalNet: { type: Number, default: 0 },         // revenus nets vendeur
  totalOrders: { type: Number, default: 0 },      // nb commandes reçues
  totalSales: { type: Number, default: 0 },       // nb produits vendus
  bankInfo: {
    bankName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    accountName: { type: String, default: "" },
  }
}, { timestamps: true });

const SellerModel = mongoose.model("Seller", sellerSchema);
export default SellerModel;