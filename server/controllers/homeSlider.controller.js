import HomeSliderModel from "../models/homeSlider.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

// GET /api/homeslider — public
export async function getHomeSliders(req, res) {
  try {
    const all = await HomeSliderModel.find({ isActive: true })
      .populate("productId", "name price images _id size")
      .sort({ order: 1, createdAt: -1 });
    return res.status(200).json({
      success: true, error: false, data: all,
      sliders:     all.filter(s => s.placement === "slider"),
      heroBanners: all.filter(s => s.placement === "hero_banner"),
      sideBanners: all.filter(s => s.placement === "side_banner"),
      carousels:   all.filter(s => s.placement === "carousel"),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// GET /api/homeslider/all — admin
export async function getAllHomeSliders(req, res) {
  try {
    const sliders = await HomeSliderModel.find()
      .populate("productId", "name price images _id")
      .sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, error: false, data: sliders });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// POST /api/homeslider — admin
export async function createHomeSlider(req, res) {
  try {
    const { image, title, subtitle, link, order, isActive,
      slideType, isPromo, promoLabel, promoBadge, promoSlogan, promoColorFrom, placement,
      isFeaturedProduct, productId, productPrice, sellerId, sellerName } = req.body;
    if (!image) return res.status(400).json({ error: true, success: false, message: "Image requise" });
    const slider = new HomeSliderModel({
      image, title, subtitle, link, order: order || 0, isActive: isActive !== false,
      slideType: slideType || "manual",
      isPromo: !!isPromo, promoLabel, promoBadge, promoSlogan, promoColorFrom,
      placement: placement || "slider",
      isFeaturedProduct: !!isFeaturedProduct,
      productId: productId || null, productPrice: productPrice || 0,
      sellerId: sellerId || null, sellerName: sellerName || "",
    });
    await slider.save();
    return res.status(200).json({ success: true, error: false, message: "Slide créé", data: slider });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// PUT /api/homeslider/:id — admin
export async function updateHomeSlider(req, res) {
  try {
    const slider = await HomeSliderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slider) return res.status(404).json({ error: true, success: false, message: "Slide introuvable" });
    return res.status(200).json({ success: true, error: false, message: "Slide mis à jour", data: slider });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// DELETE /api/homeslider/:id — admin
export async function deleteHomeSlider(req, res) {
  try {
    const slider = await HomeSliderModel.findById(req.params.id);
    if (!slider) return res.status(404).json({ error: true, success: false, message: "Slide introuvable" });
    if (!slider.isFeaturedProduct && !slider.isPromo && slider.image) {
      const urlArr = slider.image.split("/");
      const imageName = urlArr[urlArr.length - 1].split(".")[0];
      if (imageName) await cloudinary.uploader.destroy(imageName).catch(() => {});
    }
    await HomeSliderModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, error: false, message: "Slide supprimé" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// POST /api/homeslider/upload — admin upload image
export async function uploadSliderImage(req, res) {
  try {
    const images = req.files;
    if (!images || images.length === 0) return res.status(400).json({ error: true, success: false, message: "Aucun fichier" });
    const imagesArr = [];
    const options = { use_filename: true, unique_filename: false, overwrite: false };
    for (const img of images) {
      try {
        const result = await cloudinary.uploader.upload(img.path, options);
        imagesArr.push(result.secure_url);
      } catch (err) { console.error(err); }
      finally { if (fs.existsSync(img.path)) fs.unlinkSync(img.path); }
    }
    return res.status(200).json({ success: true, error: false, images: imagesArr });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// PATCH /api/homeslider/:id/toggle
export async function toggleSlider(req, res) {
  try {
    const slider = await HomeSliderModel.findById(req.params.id);
    if (!slider) return res.status(404).json({ error: true, success: false, message: "Slide introuvable" });
    slider.isActive = !slider.isActive;
    await slider.save();
    return res.status(200).json({ success: true, error: false, message: `Slide ${slider.isActive ? "activé" : "désactivé"}`, data: slider });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}







{/*import HomeSliderModel from "../models/homeSlider.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret,
  secure: true,
});

// GET /api/homeslider — public (pour l'accueil client)
export async function getHomeSliders(req, res) {
  try {
    const sliders = await HomeSliderModel.find({ isActive: true })
      .populate("productId", "name price images _id")
      .sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, error: false, data: sliders });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// GET /api/homeslider/all — admin
export async function getAllHomeSliders(req, res) {
  try {
    const sliders = await HomeSliderModel.find()
      .populate("productId", "name price images _id")
      .sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, error: false, data: sliders });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// POST /api/homeslider — admin
export async function createHomeSlider(req, res) {
  try {
    const { image, title, subtitle, link, order, isActive } = req.body;
    if (!image) return res.status(400).json({ error: true, success: false, message: "Image requise" });

    const slider = new HomeSliderModel({ image, title, subtitle, link, order: order || 0, isActive: isActive !== false });
    await slider.save();
    return res.status(200).json({ success: true, error: false, message: "Slide créé", data: slider });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// PUT /api/homeslider/:id — admin
export async function updateHomeSlider(req, res) {
  try {
    const slider = await HomeSliderModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slider) return res.status(404).json({ error: true, success: false, message: "Slide introuvable" });
    return res.status(200).json({ success: true, error: false, message: "Slide mis à jour", data: slider });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// DELETE /api/homeslider/:id — admin
export async function deleteHomeSlider(req, res) {
  try {
    const slider = await HomeSliderModel.findById(req.params.id);
    if (!slider) return res.status(404).json({ error: true, success: false, message: "Slide introuvable" });

    // Supprimer l'image cloudinary si c'est une image uploadée (non-featured)
    if (!slider.isFeaturedProduct && slider.image) {
      const urlArr = slider.image.split("/");
      const imageName = urlArr[urlArr.length - 1].split(".")[0];
      if (imageName) await cloudinary.uploader.destroy(imageName);
    }

    await HomeSliderModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, error: false, message: "Slide supprimé" });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

// POST /api/homeslider/upload — admin : upload image
export async function uploadSliderImage(req, res) {
  try {
    const images = req.files;
    if (!images || images.length === 0) {
      return res.status(400).json({ error: true, success: false, message: "Aucun fichier envoyé" });
    }
    const imagesArr = [];
    const options = { use_filename: true, unique_filename: false, overwrite: false };
    for (const img of images) {
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

// PATCH /api/homeslider/:id/toggle — admin : activer/désactiver
export async function toggleSlider(req, res) {
  try {
    const slider = await HomeSliderModel.findById(req.params.id);
    if (!slider) return res.status(404).json({ error: true, success: false, message: "Slide introuvable" });
    slider.isActive = !slider.isActive;
    await slider.save();
    return res.status(200).json({ success: true, error: false, message: `Slide ${slider.isActive ? "activé" : "désactivé"}`, data: slider });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}*/}