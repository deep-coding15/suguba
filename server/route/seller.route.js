import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  becomeSeller, getSellerProfile, updateSellerProfile,
  getSellerDashboard, getSellerProducts, getSellerOrders,
  updateOrderItemStatus, uploadSellerImage,
  getAllSellers, updateSellerStatus
} from "../controllers/seller.controller.js";

const sellerRouter = Router();

sellerRouter.post("/devenir-vendeur", auth, becomeSeller);
sellerRouter.get("/profil", auth, getSellerProfile);
sellerRouter.put("/profil", auth, updateSellerProfile);
sellerRouter.get("/dashboard", auth, getSellerDashboard);
sellerRouter.get("/produits", auth, getSellerProducts);
sellerRouter.get("/commandes", auth, getSellerOrders);
sellerRouter.put("/commande/statut", auth, updateOrderItemStatus);
sellerRouter.post("/upload-image", auth, upload.array("images"), uploadSellerImage);
sellerRouter.get("/liste-vendeurs", auth, getAllSellers);        // admin
sellerRouter.put("/statut-vendeur", auth, updateSellerStatus);  // admin

export default sellerRouter;