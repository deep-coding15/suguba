import ReviewModel from "../models/reviews.model.js";
import ProductModel from "../models/product.model.js";

export async function createReview(req, res) {
  try {
    const { productId, userId, userName, userAvatar, comment, rating } = req.body;

    if (!productId || !userId || !comment || !rating) {
      return res.status(400).json({
        error: true, success: false,
        message: "Veuillez remplir tous les champs",
      });
    }

    // Vérifier si l'utilisateur a déjà commenté ce produit
    const existing = await ReviewModel.findOne({ productId, userId });
    if (existing) {
      return res.status(400).json({
        error: true, success: false,
        message: "Vous avez déjà commenté ce produit",
      });
    }

    const review = new ReviewModel({ productId, userId, userName, userAvatar, comment, rating });
    await review.save();

    // Mettre à jour la note moyenne du produit
    const allReviews = await ReviewModel.find({ productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await ProductModel.findByIdAndUpdate(productId, { rating: Math.round(avgRating) });

    return res.status(200).json({
      success: true, error: false,
      message: "Commentaire ajouté avec succès",
      review,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}

export async function getReviewsByProduct(req, res) {
  try {
    const reviews = await ReviewModel.find({ productId: req.params.productId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true, error: false,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
}