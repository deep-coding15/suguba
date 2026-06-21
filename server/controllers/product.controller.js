import ProductModel from "../models/product.model.js";
import HomeSliderModel from "../models/homeSlider.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

export async function uploadImages(req, res) {
  try {
    const image = req.files;
    const imagesArr = [];
    if (!image || image.length === 0) {
      return res.status(400).json({ error: true, success: false, message: "Aucun fichier envoyé" });
    }
    const options = { use_filename: true, unique_filename: false, overwrite: false };
    for (const img of image) {
      try {
        const result = await cloudinary.uploader.upload(img.path, options);
        imagesArr.push(result.secure_url);
      } catch (error) {
        console.error("Erreur upload cloudinary:", error);
      } finally {
        if (fs.existsSync(img.path)) fs.unlinkSync(img.path);
      }
    }
    return res.status(200).json({ images: imagesArr, success: true, error: false });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function createProduct(req, res) {
  try {
    let product = new ProductModel({
      name: req.body.name,
      description: req.body.description,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      catName: req.body.catName,
      catId: req.body.catId,
      subCatId: req.body.subCatId,
      subCat: req.body.subCat,
      thirdsubCat: req.body.thirdsubCat,
      thirdsubCatId: req.body.thirdsubCatId,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatures: req.body.isFeatures,
      discount: req.body.discount,
      size: req.body.size,
      category: req.body.catId,
      sellerId: req.body.sellerId || null,
      sellerName: req.body.sellerName || "Suguba",
    });
    product = await product.save();
    return res.status(200).json({ message: "Produit créé avec succès", success: true, error: false, product });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        oldPrice: req.body.oldPrice,
        catName: req.body.catName,
        catId: req.body.catId,
        subCatId: req.body.subCatId,
        subCat: req.body.subCat,
        category: req.body.catId,
        thirdsubCat: req.body.thirdsubCat,
        thirdsubCatId: req.body.thirdsubCatId,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatures: req.body.isFeatures,
        discount: req.body.discount,
        size: req.body.size,
      },
      { new: true }
    );
    if (!product) return res.status(500).json({ message: "produit non modifiable", success: false, error: true });
    return res.status(200).json({ message: "Produit modifié avec succès", success: true, error: false });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Vedette : Demande de mise en avant (vendeur) ───────────────────────────
export async function requestFeatured(req, res) {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ error: true, success: false, message: "Produit introuvable" });

    if (product.sellerId?.toString() !== userId.toString()) {
      return res.status(403).json({ error: true, success: false, message: "Non autorisé" });
    }
    if (product.featuredRequest?.status === "pending") {
      return res.status(400).json({ error: true, success: false, message: "Demande déjà en cours" });
    }
    if (product.featuredRequest?.status === "approved") {
      return res.status(400).json({ error: true, success: false, message: "Produit déjà mis en avant" });
    }

    product.featuredRequest = {
      status: "pending",
      requestedAt: new Date(),
      commissionRate: 15,
    };
    await product.save();

    return res.status(200).json({
      success: true, error: false,
      message: "Demande de mise en avant envoyée à l'admin. Commission appliquée : 15%."
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Vedette : Admin liste des demandes en attente ──────────────────────────
export async function getFeaturedRequests(req, res) {
  try {
    const products = await ProductModel.find({ "featuredRequest.status": "pending" })
      .populate("sellerId", "name email avatar")
      .sort({ "featuredRequest.requestedAt": -1 });
    return res.status(200).json({ success: true, error: false, data: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Vedette : Admin approuver ou rejeter ───────────────────────────────────
export async function handleFeaturedRequest(req, res) {
  try {
    const { productId, action } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ error: true, success: false, message: "Produit introuvable" });

    if (action === "approve") {
      product.featuredRequest.status = "approved";
      product.featuredRequest.approvedAt = new Date();
      product.isFeatures = true;

      const slide = new HomeSliderModel({
        image: product.images[0],
        title: product.name,
        subtitle: `${product.price?.toLocaleString()} Fcfa`,
        link: `/produit/${product._id}`,
        isActive: true,
        isFeaturedProduct: true,
        productId: product._id,
        productPrice: product.price,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        placement: "slider",
      });
      const savedSlide = await slide.save();
      product.featuredRequest.homeSlideId = savedSlide._id;
    } else {
      product.featuredRequest.status = "rejected";
    }

    await product.save();

    return res.status(200).json({
      success: true, error: false,
      message: action === "approve" ? "Produit approuvé et ajouté à l'accueil" : "Demande rejetée"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ══════════════════════════════════════════════════════════════════════════
// ✅ NOUVEAU — OFFRE SPÉCIALE
// ══════════════════════════════════════════════════════════════════════════

// Vendeur : demande offre spéciale
export async function requestSpecialOffer(req, res) {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ error: true, success: false, message: "Produit introuvable" });

    if (product.sellerId?.toString() !== userId.toString()) {
      return res.status(403).json({ error: true, success: false, message: "Non autorisé" });
    }
    if (product.specialOfferRequest?.status === "pending") {
      return res.status(400).json({ error: true, success: false, message: "Demande Offre Spéciale déjà en cours" });
    }
    if (product.specialOfferRequest?.status === "approved") {
      return res.status(400).json({ error: true, success: false, message: "Produit déjà en Offre Spéciale" });
    }

    product.specialOfferRequest = {
      status: "pending",
      requestedAt: new Date(),
      commissionRate: 15,
    };
    await product.save();

    return res.status(200).json({
      success: true, error: false,
      message: "Demande Offre Spéciale envoyée à l'admin. Commission : 15%."
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Admin : liste des demandes offre spéciale en attente
export async function getSpecialOfferRequests(req, res) {
  try {
    const products = await ProductModel.find({ "specialOfferRequest.status": "pending" })
      .populate("sellerId", "name email avatar")
      .sort({ "specialOfferRequest.requestedAt": -1 });
    return res.status(200).json({ success: true, error: false, data: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Admin : approuver ou rejeter offre spéciale
export async function handleSpecialOfferRequest(req, res) {
  try {
    const { productId, action } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ error: true, success: false, message: "Produit introuvable" });

    if (action === "approve") {
      product.specialOfferRequest.status = "approved";
      product.specialOfferRequest.approvedAt = new Date();
      product.isSpecialOffer = true;

      // Créer un HomeSlider avec placement "special_offer"
      const slide = new HomeSliderModel({
        image: product.images[0],
        title: product.name,
        subtitle: `${product.price?.toLocaleString()} Fcfa`,
        link: `/produit/${product._id}`,
        isActive: true,
        isFeaturedProduct: false,
        isSpecialOffer: true,
        productId: product._id,
        productPrice: product.price,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        placement: "special_offer",
      });
      const savedSlide = await slide.save();
      product.specialOfferRequest.homeSlideId = savedSlide._id;
    } else {
      product.specialOfferRequest.status = "rejected";
      product.isSpecialOffer = false;
    }

    await product.save();

    return res.status(200).json({
      success: true, error: false,
      message: action === "approve" ? "Offre Spéciale approuvée et publiée sur l'accueil" : "Demande rejetée"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// Public : récupérer les produits en offre spéciale approuvés
export async function getSpecialOfferProducts(req, res) {
  try {
    const products = await ProductModel.find({ isSpecialOffer: true, "specialOfferRequest.status": "approved" })
      .populate("category");
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Nombre total de demandes en attente (vedette + offre spéciale) ─────────
export async function getPendingRequestsCount(req, res) {
  try {
    const featuredCount = await ProductModel.countDocuments({ "featuredRequest.status": "pending" });
    const specialOfferCount = await ProductModel.countDocuments({ "specialOfferRequest.status": "pending" });
    return res.status(200).json({
      success: true, error: false,
      total: featuredCount + specialOfferCount,
      featured: featuredCount,
      specialOffer: specialOfferCount
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Fonctions existantes inchangées ───────────────────────────────────────

export async function getAllProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage);
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);
    if (page > totalPages && totalPages > 0) {
      return res.status(404).json({ message: "Page non trouvé", success: false, error: true });
    }
    const products = await ProductModel.find().populate("category")
      .skip((page - 1) * perPage).limit(perPage).exec();
    return res.status(200).json({ success: true, error: false, produits: products, totalPages, Pages: page });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsByCatId(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const products = await ProductModel.find({ catId: req.params.id }).populate("category")
      .skip((page - 1) * perPage).limit(perPage).exec();
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsByCatName(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const products = await ProductModel.find({ catName: req.query.catName }).populate("category")
      .skip((page - 1) * perPage).limit(perPage).exec();
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsBySubCatId(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const products = await ProductModel.find({ subCatId: req.params.id }).populate("category")
      .skip((page - 1) * perPage).limit(perPage).exec();
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsBySubCatName(req, res) {
  try {
    const products = await ProductModel.find({ subCat: req.query.subCat }).populate("category");
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsByThirdCatId(req, res) {
  try {
    const products = await ProductModel.find({ thirdsubCatId: req.params.id }).populate("category");
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsByThirdCatName(req, res) {
  try {
    const products = await ProductModel.find({ thirdsubCat: req.query.thirdsubCat }).populate("category");
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsByPrice(req, res) {
  try {
    let productList = [];
    if (req.query.catId) productList = await ProductModel.find({ catId: req.query.catId }).populate("category");
    if (req.query.subCatId) productList = await ProductModel.find({ subCatId: req.query.subCatId }).populate("category");
    if (req.query.thirdsubCatId) productList = await ProductModel.find({ thirdsubCatId: req.query.thirdsubCatId }).populate("category");
    const filteredProducts = productList.filter(p => {
      if (req.query.minPrice && p.price < parseInt(+req.query.minPrice)) return false;
      if (req.query.maxPrice && p.price > parseInt(+req.query.maxPrice)) return false;
      return true;
    });
    return res.status(200).json({ success: true, error: false, produits: filteredProducts });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsByRating(req, res) {
  try {
    let products = [];
    if (req.query.catId) products = await ProductModel.find({ rating: req.query.rating, catId: req.query.catId }).populate("category");
    if (req.query.subCatId) products = await ProductModel.find({ rating: req.query.rating, subCatId: req.query.subCatId }).populate("category");
    if (req.query.thirdsubCatId) products = await ProductModel.find({ rating: req.query.rating, thirdsubCatId: req.query.thirdsubCatId }).populate("category");
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsCount(req, res) {
  try {
    const productsCount = await ProductModel.countDocuments();
    return res.status(200).json({ success: true, error: false, nombreDeProduits: productsCount });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllFeaturedProducts(req, res) {
  try {
    const products = await ProductModel.find({ isFeatures: true }).populate("category");
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "produit introuvable", success: false, error: true });
    for (const imgUrl of product.images) {
      const urlArr = imgUrl.split("/");
      const imageName = urlArr[urlArr.length - 1].split(".")[0];
      if (imageName) cloudinary.uploader.destroy(imageName);
    }
    await ProductModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, error: false, message: "produit supprimé" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getProduct(req, res) {
  try {
    const product = await ProductModel.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "produit introuvable", success: false, error: true });
    return res.status(200).json({ success: true, error: false, produits: product });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function removeImageFromCloudinary(req, res) {
  try {
    const imgUrl = req.query.img;
    if (!imgUrl) return res.status(400).json({ error: true, success: false, message: "URL de l'image manquante" });
    const urlArr = imgUrl.split("/");
    const imageName = urlArr[urlArr.length - 1].split(".")[0];
    if (!imageName) return res.status(400).json({ error: true, success: false, message: "Nom de l'image invalide" });
    const result = await cloudinary.uploader.destroy(imageName);
    return res.status(200).json({ error: false, success: true, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export const searchProductController = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ success: false, message: "Query manquante" });
    const products = await ProductModel.find({ name: { $regex: q, $options: "i" } }).limit(10);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export async function getProductsByFilters(req, res) {
  try {
    const { category, subCat, thirdCat, minPrice, maxPrice, page = 1, perPage = 12 } = req.query;
    let filter = {};
    if (thirdCat) filter.thirdsubCatId = thirdCat;
    else if (subCat) filter.subCatId = subCat;
    else if (category) filter.catId = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const totalProducts = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / Number(perPage));
    const products = await ProductModel.find(filter).populate("category")
      .skip((Number(page) - 1) * Number(perPage)).limit(Number(perPage));
    return res.status(200).json({ success: true, error: false, produits: products, totalPages, page: Number(page) });
  } catch (error) {
    return res.status(500).json({ success: false, error: true, message: error.message });
  }
}






{/*import ProductModel from "../models/product.model.js";
import HomeSliderModel from "../models/homeSlider.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

export async function uploadImages(req, res) {
  try {
    const image = req.files;
    const imagesArr = [];
    if (!image || image.length === 0) {
      return res.status(400).json({ error: true, success: false, message: "Aucun fichier envoyé" });
    }
    const options = { use_filename: true, unique_filename: false, overwrite: false };
    for (const img of image) {
      try {
        const result = await cloudinary.uploader.upload(img.path, options);
        imagesArr.push(result.secure_url);
      } catch (error) {
        console.error("Erreur upload cloudinary:", error);
      } finally {
        if (fs.existsSync(img.path)) fs.unlinkSync(img.path);
      }
    }
    return res.status(200).json({ images: imagesArr, success: true, error: false });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function createProduct(req, res) {
  try {
    let product = new ProductModel({
      name: req.body.name,
      description: req.body.description,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      catName: req.body.catName,
      catId: req.body.catId,
      subCatId: req.body.subCatId,
      subCat: req.body.subCat,
      thirdsubCat: req.body.thirdsubCat,
      thirdsubCatId: req.body.thirdsubCatId,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatures: req.body.isFeatures,
      discount: req.body.discount,
      size: req.body.size,
      category: req.body.catId,
      sellerId: req.body.sellerId || null,
      sellerName: req.body.sellerName || "Suguba",
    });
    product = await product.save();
    return res.status(200).json({ message: "Produit créé avec succès", success: true, error: false, product });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        oldPrice: req.body.oldPrice,
        catName: req.body.catName,
        catId: req.body.catId,
        subCatId: req.body.subCatId,
        subCat: req.body.subCat,
        category: req.body.catId,
        thirdsubCat: req.body.thirdsubCat,
        thirdsubCatId: req.body.thirdsubCatId,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        isFeatures: req.body.isFeatures,
        discount: req.body.discount,
        size: req.body.size,
      },
      { new: true }
    );
    if (!product) return res.status(500).json({ message: "produit non modifiable", success: false, error: true });
    return res.status(200).json({ message: "Produit modifié avec succès", success: true, error: false });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Demande de mise en avant (vendeur) ─────────────────────────────────────
export async function requestFeatured(req, res) {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ error: true, success: false, message: "Produit introuvable" });

    // Vérifier que c'est bien le produit du vendeur
    if (product.sellerId?.toString() !== userId.toString()) {
      return res.status(403).json({ error: true, success: false, message: "Non autorisé" });
    }

    if (product.featuredRequest?.status === "pending") {
      return res.status(400).json({ error: true, success: false, message: "Demande déjà en cours" });
    }
    if (product.featuredRequest?.status === "approved") {
      return res.status(400).json({ error: true, success: false, message: "Produit déjà mis en avant" });
    }

    product.featuredRequest = {
      status: "pending",
      requestedAt: new Date(),
      commissionRate: 15,
    };
    await product.save();

    return res.status(200).json({
      success: true, error: false,
      message: "Demande de mise en avant envoyée à l'admin. Commission appliquée : 15%."
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Admin : liste des demandes en attente ──────────────────────────────────
export async function getFeaturedRequests(req, res) {
  try {
    const products = await ProductModel.find({ "featuredRequest.status": "pending" })
      .populate("sellerId", "name email avatar")
      .sort({ "featuredRequest.requestedAt": -1 });
    return res.status(200).json({ success: true, error: false, data: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// ── Admin : approuver ou rejeter une demande de mise en avant ──────────────
export async function handleFeaturedRequest(req, res) {
  try {
    const { productId, action } = req.body; // action: "approve" | "reject"

    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ error: true, success: false, message: "Produit introuvable" });

    if (action === "approve") {
      product.featuredRequest.status = "approved";
      product.featuredRequest.approvedAt = new Date();
      product.isFeatures = true;

      // Créer un HomeSlide automatiquement
      const slide = new HomeSliderModel({
        image: product.images[0],
        title: product.name,
        subtitle: `${product.price?.toLocaleString()} Fcfa`,
        link: `/produit/${product._id}`,
        isActive: true,
        isFeaturedProduct: true,
        productId: product._id,
        productPrice: product.price,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
      });
      const savedSlide = await slide.save();
      product.featuredRequest.homeSlideId = savedSlide._id;
    } else {
      product.featuredRequest.status = "rejected";
    }

    await product.save();

    return res.status(200).json({
      success: true, error: false,
      message: action === "approve" ? "Produit approuvé et ajouté à l'accueil" : "Demande rejetée"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage);
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);
    if (page > totalPages && totalPages > 0) {
      return res.status(404).json({ message: "Page non trouvé", success: false, error: true });
    }
    const products = await ProductModel.find().populate("category")
      .skip((page - 1) * perPage).limit(perPage).exec();
    return res.status(200).json({ success: true, error: false, produits: products, totalPages, Pages: page });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsByCatId(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);
    const products = await ProductModel.find({ catId: req.params.id }).populate("category")
      .skip((page - 1) * perPage).limit(perPage).exec();
    return res.status(200).json({ success: true, error: false, produits: products, totalPages, Pages: page });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsByCatName(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);
    const products = await ProductModel.find({ catName: req.query.catName }).populate("category")
      .skip((page - 1) * perPage).limit(perPage).exec();
    return res.status(200).json({ success: true, error: false, produits: products, totalPages, Pages: page });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsBySubCatId(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10000;
    const products = await ProductModel.find({ subCatId: req.params.id }).populate("category")
      .skip((page - 1) * perPage).limit(perPage).exec();
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsBySubCatName(req, res) {
  try {
    const products = await ProductModel.find({ subCat: req.query.subCat }).populate("category");
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsByThirdCatId(req, res) {
  try {
    const products = await ProductModel.find({ thirdsubCatId: req.params.id }).populate("category");
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsByThirdCatName(req, res) {
  try {
    const products = await ProductModel.find({ thirdsubCat: req.query.thirdsubCat }).populate("category");
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsByPrice(req, res) {
  try {
    let productList = [];
    if (req.query.catId) productList = await ProductModel.find({ catId: req.query.catId }).populate("category");
    if (req.query.subCatId) productList = await ProductModel.find({ subCatId: req.query.subCatId }).populate("category");
    if (req.query.thirdsubCatId) productList = await ProductModel.find({ thirdsubCatId: req.query.thirdsubCatId }).populate("category");
    const filteredProducts = productList.filter(p => {
      if (req.query.minPrice && p.price < parseInt(+req.query.minPrice)) return false;
      if (req.query.maxPrice && p.price > parseInt(+req.query.maxPrice)) return false;
      return true;
    });
    return res.status(200).json({ success: true, error: false, produits: filteredProducts });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsByRating(req, res) {
  try {
    let products = [];
    if (req.query.catId) products = await ProductModel.find({ rating: req.query.rating, catId: req.query.catId }).populate("category");
    if (req.query.subCatId) products = await ProductModel.find({ rating: req.query.rating, subCatId: req.query.subCatId }).populate("category");
    if (req.query.thirdsubCatId) products = await ProductModel.find({ rating: req.query.rating, thirdsubCatId: req.query.thirdsubCatId }).populate("category");
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllProductsCount(req, res) {
  try {
    const productsCount = await ProductModel.countDocuments();
    return res.status(200).json({ success: true, error: false, nombreDeProduits: productsCount });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getAllFeaturedProducts(req, res) {
  try {
    const products = await ProductModel.find({ isFeatures: true }).populate("category");
    return res.status(200).json({ success: true, error: false, produits: products });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function deleteProduct(req, res) {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "produit introuvable", success: false, error: true });
    for (const imgUrl of product.images) {
      const urlArr = imgUrl.split("/");
      const imageName = urlArr[urlArr.length - 1].split(".")[0];
      if (imageName) cloudinary.uploader.destroy(imageName);
    }
    await ProductModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, error: false, message: "produit supprimé" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getProduct(req, res) {
  try {
    const product = await ProductModel.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "produit introuvable", success: false, error: true });
    return res.status(200).json({ success: true, error: false, produits: product });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function removeImageFromCloudinary(req, res) {
  try {
    const imgUrl = req.query.img;
    if (!imgUrl) return res.status(400).json({ error: true, success: false, message: "URL de l'image manquante" });
    const urlArr = imgUrl.split("/");
    const imageName = urlArr[urlArr.length - 1].split(".")[0];
    if (!imageName) return res.status(400).json({ error: true, success: false, message: "Nom de l'image invalide" });
    const result = await cloudinary.uploader.destroy(imageName);
    return res.status(200).json({ error: false, success: true, data: result });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export const searchProductController = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ success: false, message: "Query manquante" });
    const products = await ProductModel.find({ name: { $regex: q, $options: "i" } }).limit(10);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export async function getProductsByFilters(req, res) {
  try {
    const { category, subCat, thirdCat, minPrice, maxPrice, page = 1, perPage = 12 } = req.query;
    let filter = {};
    if (thirdCat) filter.thirdsubCatId = thirdCat;
    else if (subCat) filter.subCatId = subCat;
    else if (category) filter.catId = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const totalProducts = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / Number(perPage));
    const products = await ProductModel.find(filter).populate("category")
      .skip((Number(page) - 1) * Number(perPage)).limit(Number(perPage));
    return res.status(200).json({ success: true, error: false, produits: products, totalPages, page: Number(page) });
  } catch (error) {
    return res.status(500).json({ success: false, error: true, message: error.message });
  }
}
*/}



{/*import ProductModel from "../models/product.model.js";
import{v2 as cloudinary} from "cloudinary";
import fs from "fs";
import { skipMiddlewareFunction } from "mongoose";
cloudinary.config({
    cloud_name:process.env.cloudinary_Config_Cloud_Name,
    api_key:process.env.cloudinary_Config_api_key,
    api_secret:process.env.cloudinary_Config_api_secret,
    secure:true,
});
 
export async function uploadImages(req, res) {
    try {
        const image = req.files;
        const imagesArr = []; // ✅ LOCAL (clé de la solution)

        if (!image || image.length === 0) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Aucun fichier envoyé"
            });
        }

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        for (const img of image) {
            try {
                const result = await cloudinary.uploader.upload(img.path, options);
                imagesArr.push(result.secure_url);
            } catch (error) {
                console.error("Erreur upload cloudinary:", error);
            } finally {
                if (fs.existsSync(img.path)) {
                    fs.unlinkSync(img.path);
                }
            }
        }

        return res.status(200).json({
            images: imagesArr,
            success: true,
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
            error: true
        });
    }
}
export async function updateProduct(req, res) {
    try {
        const product = await ProductModel.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                images: req.body.images,
                brand: req.body.brand,
                price: req.body.price,
                oldPrice: req.body.oldPrice,
                catName: req.body.catName,
                catId: req.body.catId,
                subCatId: req.body.subCatId,
                subCat: req.body.subCat,
                category: req.body.catId,
                thirdsubCat: req.body.thirdsubCat,
                thirdsubCatId: req.body.thirdsubCatId,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                isFeatures: req.body.isFeatures,
                discount: req.body.discount,
                size: req.body.size,
            },
            { new: true }
        );

        if (!product) {
            return res.status(500).json({
                message: "produit non modifiable",
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            message: "Produit modifié avec succès",
            success: true,
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
            error: true
        });
    }
}
export async function getAllProducts(req,res) {
 try {

     const page=parseInt(req.query.page) || 1;
       const perPage=parseInt(req.query.perPage);
      const totalPosts=await ProductModel.countDocuments();
      const totalPages=Math.ceil(totalPosts/perPage);
    if (page>totalPages) {
         return res.status(404).json({
                message:"Page non trouvé",
                success:false,
                error:true
            });
    }
        const products=await ProductModel.find().populate("category")
        .skip((page-1)*perPage)
        .limit(perPage)
        .exec();
        if (!products) {
             res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
        }
       return  res.status(200).json({
                success:true,
                error:false,
                produits:products,
               totalPages:totalPages,
               Pages:page

            });
    }catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function getAllProductsByCatId(req,res) {
 try {

     const page=parseInt(req.query.page) || 1;
       const perPage=parseInt(req.query.perPage) || 10000;
      const totalPosts=await ProductModel.countDocuments();
      const totalPages=Math.ceil(totalPosts/perPage);
    if (page>totalPages){
         return res.status(404).json({
                message:"Page non trouvé",
                success:false,
                error:true
            });
    }
        const products=await ProductModel.find({
            catId:req.params.id
        }).populate("category")
        .skip((page-1)*perPage)
        .limit(perPage)
        .exec();
        if (!products) {
             res.status(500).json({
                message:"produit introuvable",
                success:false,
                error:true
            })
        }
       return  res.status(200).json({
                success:true,
                error:false,
                produits:products,
               totalPages:totalPages,
               Pages:page

            });
    }catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function getAllProductsByCatName(req,res) {
 try {

     const page=parseInt(req.query.page) || 1;
       const perPage=parseInt(req.query.perPage) || 10000;
      const totalPosts=await ProductModel.countDocuments();
      const totalPages=Math.ceil(totalPosts/perPage);
    if (page>totalPages){
         return res.status(404).json({
                message:"Page non trouvé",
                success:false,
                error:true
            });
    }
        const products=await ProductModel.find({
            catName:req.query.catName
        }).populate("category")
        .skip((page-1)*perPage)
        .limit(perPage)
        .exec();
        if (!products) {
             res.status(500).json({
                message:"produit introuvable",
                success:false,
                error:true
            })
        }
       return  res.status(200).json({
                success:true,
                error:false,
                produits:products,
               totalPages:totalPages,
               Pages:page

            });
    }catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function getAllProductsBySubCatId(req,res) {
 try {

     const page=parseInt(req.query.page) || 1;
       const perPage=parseInt(req.query.perPage) || 10000;
      const totalPosts=await ProductModel.countDocuments();
      const totalPages=Math.ceil(totalPosts/perPage);
    if (page>totalPages){
         return res.status(404).json({
                message:"Page non trouvé",
                success:false,
                error:true
            });
    }
        const products=await ProductModel.find({
            subCatId:req.params.id
        }).populate("category")
        .skip((page-1)*perPage)
        .limit(perPage)
        .exec();
        if (!products) {
             res.status(500).json({
                message:"produit introuvable",
                success:false,
                error:true
            })
        }
       return  res.status(200).json({
                success:true,
                error:false,
                produits:products,
               totalPages:totalPages,
               Pages:page

            });
    }catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function getAllProductsBySubCatName(req,res) {
 try {

     const page=parseInt(req.query.page) || 1;
       const perPage=parseInt(req.query.perPage) || 10000;
      const totalPosts=await ProductModel.countDocuments();
      const totalPages=Math.ceil(totalPosts/perPage);
    if (page>totalPages){
         return res.status(404).json({
                message:"Page non trouvé",
                success:false,
                error:true
            });
    }
        const products=await ProductModel.find({
           subCat:req.query.subCat
        }).populate("category")
        .skip((page-1)*perPage)
        .limit(perPage)
        .exec();
        if (!products) {
             res.status(500).json({
                message:"produit introuvable",
                success:false,
                error:true
            })
        }
       return  res.status(200).json({
                success:true,
                error:false,
                produits:products,
               totalPages:totalPages,
               Pages:page

            });
    }catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function getAllProductsByThirdCatId(req,res) {
 try {

     const page=parseInt(req.query.page) || 1;
       const perPage=parseInt(req.query.perPage) || 10000;
      const totalPosts=await ProductModel.countDocuments();
      const totalPages=Math.ceil(totalPosts/perPage);
    if (page>totalPages){
         return res.status(404).json({
                message:"Page non trouvé",
                success:false,
                error:true
            });
    }
        const products=await ProductModel.find({
            thirdsubCatId:req.params.id
        }).populate("category")
        .skip((page-1)*perPage)
        .limit(perPage)
        .exec();
        if (!products) {
             res.status(500).json({
                message:"produit introuvable",
                success:false,
                error:true
            })
        }
       return  res.status(200).json({
                success:true,
                error:false,
                produits:products,
               totalPages:totalPages,
               Pages:page

            });
    }catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function getAllProductsByThirdCatName(req,res) {
 try {

     const page=parseInt(req.query.page) || 1;
       const perPage=parseInt(req.query.perPage) || 10000;
      const totalPosts=await ProductModel.countDocuments();
      const totalPages=Math.ceil(totalPosts/perPage);
    if (page>totalPages){
         return res.status(404).json({
                message:"Page non trouvé",
                success:false,
                error:true
            });
    }
        const products=await ProductModel.find({
           thirdsubCat:req.query.thirdsubCat
        }).populate("category")
        .skip((page-1)*perPage)
        .limit(perPage)
        .exec();
        if (!products) {
             res.status(500).json({
                message:"produit introuvable",
                success:false,
                error:true
            })
        }
       return  res.status(200).json({
                success:true,
                error:false,
                produits:products,
               totalPages:totalPages,
               Pages:page

            });
    }catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function getAllProductsByPrice(req,res) {
    try {
        let productList=[];
        if (req.query.catId !== "" && req.query.catId !== undefined) {
            const productListArr=await ProductModel.find({
                catId:req.query.catId
            }).populate("category");
            productList=productListArr;
        }
         if (req.query.subCatId !== "" && req.query.subCatId !== undefined) {
            const productListArr=await ProductModel.find({
                subCatId:req.query.subCatId
            }).populate("category");
            productList=productListArr;
        }
         if (req.query.thirdsubCatId !== "" && req.query.thirdsubCatId !== undefined) {
            const productListArr=await ProductModel.find({
                thirdsubCatId:req.query.thirdsubCatId
            }).populate("category");
            productList=productListArr;
        }
        const filteredProducts=productList.filter((product)=>{
            if (req.query.minPrice && product.price < parseInt(+req.query.minPrice)) {
                return false;
            }
             if (req.query.maxPrice && product.price >  parseInt(+req.query.maxPrice)) {
                return false;
            }
            return true;
        });
        return res.status(200).json({
                success:true,
                error:false,
                produits:filteredProducts,
                totalPages:0,
                page:0
            });
    } catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function getAllProductsByRating(req,res) {
 try {

     const page=parseInt(req.query.page) || 1;
       const perPage=parseInt(req.query.perPage) || 10000;
      const totalPosts=await ProductModel.countDocuments();
      const totalPages=Math.ceil(totalPosts/perPage);
    if (page>totalPages){
         return res.status(404).json({
                message:"Page non trouvé",
                success:false,
                error:true
            });
    }
    let products=[];
    if (req.query.catId !==undefined) {
         products=await ProductModel.find({
           rating:req.query.rating,
           catId:req.query.catId
        }).populate("category")
        .skip((page-1)*perPage)
        .limit(perPage)
        .exec();
    }
    if (req.query.subCatId !==undefined) {
         products=await ProductModel.find({
           rating:req.query.rating,
           subCatId:req.query.subCatId
        }).populate("category")
        .skip((page-1)*perPage)
        .limit(perPage)
        .exec();
    }
     if (req.query.thirdsubCatId !==undefined) {
         products=await ProductModel.find({
           rating:req.query.rating,
           thirdsubCatId :req.query.thirdsubCatId 
        }).populate("category")
        .skip((page-1)*perPage)
        .limit(perPage)
        .exec();
    }
        if (!products) {
             res.status(500).json({
                message:"produit introuvable",
                success:false,
                error:true
            })
        }
       return  res.status(200).json({
                success:true,
                error:false,
                produits:products,
               totalPages:totalPages,
               Pages:page

            });
    }catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function getAllProductsCount(req,res) {
    try {
        const productsCount=await ProductModel.countDocuments();
        if (!productsCount) {
            return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
        }
        return res.status(200).json({
                success:true,
                error:false,
                nombreDeProduits:productsCount
            })
    } catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function getAllFeaturedProducts(req,res) {
 try {
        const products=await ProductModel.find({
           isFeatures:true
        }).populate("category");
        
        if (!products) {
             res.status(500).json({
                message:"produit introuvable",
                success:false,
                error:true
            })
        }
       return  res.status(200).json({
                success:true,
                error:false,
                produits:products
            });
    }catch (error) {
        return res.status(500).json({
                message:error.message || error,
                success:false,
                error:true
            })
    }
}
export async function deleteProduct(req,res) {
    try {
        const product=await ProductModel.findById(req.params.id).populate("category");
        if (!product) {
             res.status(500).json({
                message:"produit introuvable",
                success:false,
                error:true
            })
        }
        const images=product.images;
        let img="";
        for(img of images){
            const imgUrl =img;
            const urlArr=imgUrl.split("/");
            const image=urlArr[urlArr.length-1];
            const imageName=image.split(".")[0];
            if (imageName) {
                cloudinary.uploader.destroy(imageName);
            }
        }
        const deleteProduct=await ProductModel.findByIdAndDelete(req.params.id);
         if (!deleteProduct) {
             res.status(500).json({
                message:"produit non supprimé",
                success:false,
                error:true
            })
        }
        return  res.status(200).json({
                success:true,
                error:false,
                message:"produit supprimé"
            });
    } catch (error) {
       return res.status(500).json({
                message:"produit non trouvé",
                success:false,
                error:true
            }) 
    }
}
export async function getProduct(req,res) {
    try {
        const product=await ProductModel.findById(req.params.id).populate("category");
        if (!product) {
             res.status(500).json({
                message:"produit introuvable",
                success:false,
                error:true
            })
        }
       return  res.status(200).json({
                success:true,
                error:false,
                produits:product
            });
    } catch (error) {
       return res.status(500).json({
                message:"produit non trouvé",
                success:false,
                error:true
            }) 
    }
}
export async function removeImageFromCloudinary(req, res) {
    try {
        const imgUrl = req.query.img;

        if (!imgUrl) {
            return res.status(400).json({ error: true, success: false, message: "URL de l'image manquante" });
        }

        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split(".")[0];

        if (!imageName) {
            return res.status(400).json({ error: true, success: false, message: "Nom de l'image invalide" });
        }

        const result = await cloudinary.uploader.destroy(imageName);
        if (result) {
          return res.status(200).json({ error: false, success: true, data: result });   
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}


// /api/product/search
export const searchProductController = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Query manquante"
      });
    }

    const products = await ProductModel.find({
      name: { $regex: q, $options: "i" } // 🔥 recherche insensible à la casse
    }).limit(10);

    return res.status(200).json({
      success: true,
      data: products
    });

  } catch (error) {
    console.log("ERREUR SEARCH:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export async function getProductsByFilters(req, res) {
  try {
    const { category, subCat, thirdCat, minPrice, maxPrice, page = 1, perPage = 12 } = req.query;

    let filter = {};

    if (thirdCat) {
      filter.thirdsubCatId = thirdCat;
    } else if (subCat) {
      filter.subCatId = subCat;
    } else if (category) {
      filter.catId = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const totalProducts = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / Number(perPage));

    const products = await ProductModel.find(filter)
      .populate("category")
      .skip((Number(page) - 1) * Number(perPage))
      .limit(Number(perPage));

    return res.status(200).json({
      success: true, error: false,
      produits: products, totalPages, page: Number(page)
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: true, message: error.message });
  }
}
export async function createProduct(req, res) {
  try {
    let product = new ProductModel({
      name: req.body.name,
      description: req.body.description,
      images: req.body.images,
      brand: req.body.brand,
      price: req.body.price,
      oldPrice: req.body.oldPrice,
      catName: req.body.catName,
      catId: req.body.catId,
      subCatId: req.body.subCatId,
      subCat: req.body.subCat,
      thirdsubCat: req.body.thirdsubCat,
      thirdsubCatId: req.body.thirdsubCatId,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      isFeatures: req.body.isFeatures,
      discount: req.body.discount,
      size: req.body.size,
      category: req.body.catId,
      sellerId: req.body.sellerId || null,
      sellerName: req.body.sellerName || "Suguba",
    });
    product = await product.save();
    return res.status(200).json({ message: "Produit créé avec succès", success: true, error: false });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}*/}
{/*export async function createProduct(req, res) {
    try {
        let product = new ProductModel({
            name: req.body.name,
            description: req.body.description,
            images: req.body.images, // ✅ LA SOLUTION
            brand: req.body.brand,
            price: req.body.price,
            oldPrice: req.body.oldPrice,
            catName: req.body.catName,
            catId: req.body.catId,
            subCatId: req.body.subCatId,
            subCat: req.body.subCat,
            thirdsubCat: req.body.thirdsubCat,
            thirdsubCatId: req.body.thirdsubCatId,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            isFeatures: req.body.isFeatures,
            discount: req.body.discount,
            size: req.body.size,
            category: req.body.catId,
        });

        product = await product.save();

        return res.status(200).json({
            message: "Produit créé avec succès",
            success: true,
            error: false
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false,
            error: true
        });
    }
} */}