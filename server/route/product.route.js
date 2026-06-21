import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  createProduct, deleteProduct, getAllFeaturedProducts, getAllProducts,
  getAllProductsByCatId, getAllProductsByCatName, getAllProductsByPrice,
  getAllProductsByRating, getAllProductsBySubCatId, getAllProductsBySubCatName,
  getAllProductsByThirdCatId, getAllProductsByThirdCatName, getAllProductsCount,
  getProduct, getProductsByFilters, removeImageFromCloudinary,
  searchProductController, updateProduct, uploadImages,
  // Vedette
  requestFeatured, getFeaturedRequests, handleFeaturedRequest,
  // ✅ Offre Spéciale
  requestSpecialOffer, getSpecialOfferRequests, handleSpecialOfferRequest,
  getSpecialOfferProducts, getPendingRequestsCount
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/chargement-image", auth, upload.array("images"), uploadImages);
productRouter.post("/creation-produit", auth, createProduct);
productRouter.get("/produits", getAllProducts);
productRouter.get("/produit-partCatId/:id", getAllProductsByCatId);
productRouter.get("/produit-partCatName", getAllProductsByCatName);
productRouter.get("/produit-partSubCatId/:id", getAllProductsBySubCatId);
productRouter.get("/produit-partSubCatName", getAllProductsBySubCatName);
productRouter.get("/produit-parThirdCatId/:id", getAllProductsByThirdCatId);
productRouter.get("/produit-parThirdCatName", getAllProductsByThirdCatName);
productRouter.get("/produit-parPrix", getAllProductsByPrice);
productRouter.get("/produit-parAvis", getAllProductsByRating);
productRouter.get("/produit-nombre", getAllProductsCount);
productRouter.get("/produit-fare", getAllFeaturedProducts);
productRouter.delete("/suppression-produit/:id", auth, deleteProduct);
productRouter.get("/produit/:id", getProduct);
productRouter.delete("/suppression-imaget", auth, removeImageFromCloudinary);
productRouter.put("/modification-produit/:id", auth, updateProduct);
productRouter.get("/produits-filtres", getProductsByFilters);
productRouter.get("/search", searchProductController);

// ── Vedette (mise en avant) ────────────────────────────────────────────────
productRouter.post("/demande-mise-en-avant", auth, requestFeatured);
productRouter.get("/demandes-mise-en-avant", auth, getFeaturedRequests);
productRouter.post("/gestion-mise-en-avant", auth, handleFeaturedRequest);

// ── Offre Spéciale ✅ ──────────────────────────────────────────────────────
productRouter.post("/demande-offre-speciale", auth, requestSpecialOffer);
productRouter.get("/demandes-offre-speciale", auth, getSpecialOfferRequests);
productRouter.post("/gestion-offre-speciale", auth, handleSpecialOfferRequest);
productRouter.get("/offres-speciales", getSpecialOfferProducts); // public — accueil client

// ── Compteur global demandes en attente (icône notif header admin) ─────────
productRouter.get("/demandes-en-attente-count", auth, getPendingRequestsCount);

export default productRouter;







{/*import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  createProduct, deleteProduct, getAllFeaturedProducts, getAllProducts,
  getAllProductsByCatId, getAllProductsByCatName, getAllProductsByPrice,
  getAllProductsByRating, getAllProductsBySubCatId, getAllProductsBySubCatName,
  getAllProductsByThirdCatId, getAllProductsByThirdCatName, getAllProductsCount,
  getProduct, getProductsByFilters, removeImageFromCloudinary,
  searchProductController, updateProduct, uploadImages,
  requestFeatured, getFeaturedRequests, handleFeaturedRequest
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.post("/chargement-image", auth, upload.array("images"), uploadImages);
productRouter.post("/creation-produit", auth, createProduct);
productRouter.get("/produits", getAllProducts);
productRouter.get("/produit-partCatId/:id", getAllProductsByCatId);
productRouter.get("/produit-partCatName", getAllProductsByCatName);
productRouter.get("/produit-partSubCatId/:id", getAllProductsBySubCatId);
productRouter.get("/produit-partSubCatName", getAllProductsBySubCatName);
productRouter.get("/produit-parThirdCatId/:id", getAllProductsByThirdCatId);
productRouter.get("/produit-parThirdCatName", getAllProductsByThirdCatName);
productRouter.get("/produit-parPrix", getAllProductsByPrice);
productRouter.get("/produit-parAvis", getAllProductsByRating);
productRouter.get("/produit-nombre", getAllProductsCount);
productRouter.get("/produit-fare", getAllFeaturedProducts);
productRouter.delete("/suppression-produit/:id", auth, deleteProduct);
productRouter.get("/produit/:id", getProduct);
productRouter.delete("/suppression-imaget", auth, removeImageFromCloudinary);
productRouter.put("/modification-produit/:id", auth, updateProduct);
productRouter.get("/produits-filtres", getProductsByFilters);
productRouter.get("/search", searchProductController);

// Mise en avant
productRouter.post("/demande-mise-en-avant", auth, requestFeatured);           // vendeur
productRouter.get("/demandes-mise-en-avant", auth, getFeaturedRequests);       // admin
productRouter.post("/gestion-mise-en-avant", auth, handleFeaturedRequest);     // admin

export default productRouter;
*/}

{/*import {Router} from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createProduct, deleteProduct, getAllFeaturedProducts, getAllProducts, getAllProductsByCatId, getAllProductsByCatName, getAllProductsByPrice,
     getAllProductsByRating, getAllProductsBySubCatId, getAllProductsBySubCatName, 
     getAllProductsByThirdCatId, getAllProductsByThirdCatName, getAllProductsCount, getProduct, getProductsByFilters, removeImageFromCloudinary, searchProductController, updateProduct, uploadImages } from "../controllers/product.controller.js";


const productRouter=Router()

productRouter.post("/chargement-image",auth,upload.array("images"),uploadImages);
productRouter.post("/creation-produit",auth,createProduct);
productRouter.get("/produits",getAllProducts);
productRouter.get("/produit-partCatId/:id",getAllProductsByCatId);
productRouter.get("/produit-partCatName",getAllProductsByCatName);
productRouter.get("/produit-partSubCatId/:id",getAllProductsBySubCatId);
productRouter.get("/produit-partSubCatName",getAllProductsBySubCatName);
productRouter.get("/produit-parThirdCatId/:id",getAllProductsByThirdCatId);
productRouter.get("/produit-parThirdCatName",getAllProductsByThirdCatName);
productRouter.get("/produit-parPrix",getAllProductsByPrice);
productRouter.get("/produit-parAvis",getAllProductsByRating);
productRouter.get("/produit-nombre", getAllProductsCount);
productRouter.get("/produit-fare", getAllFeaturedProducts);
productRouter.delete("/suppression-produit/:id", deleteProduct);
productRouter.get("/produit/:id", getProduct);
productRouter.delete("/suppression-imaget", auth,removeImageFromCloudinary);
productRouter.put("/modification-produit/:id", updateProduct);
productRouter.get("/produits-filtres", getProductsByFilters);
productRouter.get("/search", searchProductController);

export default productRouter;*/}