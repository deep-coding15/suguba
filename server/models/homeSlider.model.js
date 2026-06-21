import mongoose from "mongoose";

const homeSliderSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  link: { type: String, default: "/" },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },

  slideType: {
    type: String,
    enum: ["manual", "featured_product", "promo", "special_offer"],
    default: "manual"
  },

  // Données produit mis en avant (Vedette)
  isFeaturedProduct: { type: Boolean, default: false },

  // ✅ NOUVEAU — Offre Spéciale
  isSpecialOffer: { type: Boolean, default: false },

  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
  productPrice: { type: Number, default: 0 },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  sellerName: { type: String, default: "" },

  // Données promo (bannières + carrousel)
  isPromo: { type: Boolean, default: false },
  promoLabel: { type: String, default: "" },
  promoBadge: { type: String, default: "" },
  promoSlogan: { type: String, default: "" },
  promoColorFrom: { type: String, default: "from-pink-500" },

  // placement étendu avec special_offer
  placement: {
    type: String,
    enum: ["slider", "hero_banner", "side_banner", "carousel", "special_offer"],
    default: "slider"
  },

}, { timestamps: true });

const HomeSliderModel = mongoose.model("HomeSlider", homeSliderSchema);
export default HomeSliderModel;



{/*import mongoose from "mongoose";

const homeSliderSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  link: { type: String, default: "/" },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },

  slideType: {
    type: String,
    enum: ["manual", "featured_product", "promo"],
    default: "manual"
  },

  // Données produit mis en avant
  isFeaturedProduct: { type: Boolean, default: false },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
  productPrice: { type: Number, default: 0 },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  sellerName: { type: String, default: "" },

  // Données promo (bannières + carrousel)
  isPromo: { type: Boolean, default: false },
  promoLabel: { type: String, default: "" },
  promoBadge: { type: String, default: "" },
  promoSlogan: { type: String, default: "" },
  promoColorFrom: { type: String, default: "from-pink-500" },
  // placement: slider=carrousel héro, hero_banner=grande bannière, side_banner=petite droite, carousel=carrousel bas
  placement: {
    type: String,
    enum: ["slider", "hero_banner", "side_banner", "carousel"],
    default: "slider"
  },

}, { timestamps: true });

const HomeSliderModel = mongoose.model("HomeSlider", homeSliderSchema);
export default HomeSliderModel;
*/}




{/*import mongoose from "mongoose";

const homeSliderSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  link: { type: String, default: "/" },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },

  // Si le slide vient d'une demande "mise en avant" d'un vendeur
  isFeaturedProduct: { type: Boolean, default: false },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
  productPrice: { type: Number, default: 0 },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  sellerName: { type: String, default: "" },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null }, // ref to product with pending request
}, { timestamps: true });

const HomeSliderModel = mongoose.model("HomeSlider", homeSliderSchema);
export default HomeSliderModel;

*/}


{/*import mongoose from "mongoose";

const homeSliderSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  link: { type: String, default: "/" },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const HomeSliderModel = mongoose.model("HomeSlider", homeSliderSchema);
export default HomeSliderModel;*/}