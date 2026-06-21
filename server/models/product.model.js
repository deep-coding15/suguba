import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  brand: { type: String, default: "" },
  price: { type: Number, default: 0 },
  oldPrice: { type: Number, default: 0 },
  catName: { type: String, default: "" },
  catId: { type: String, default: "" },
  subCatId: { type: String, default: "" },
  subCat: { type: String, default: "" },
  thirdsubCat: { type: String, default: "" },
  thirdsubCatId: { type: String, default: "" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  countInStock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isFeatures: { type: Boolean, default: false },
  isSpecialOffer: { type: Boolean, default: false }, // ✅ NOUVEAU
  discount: { type: Number, required: true },
  size: [{ type: String, default: null }],
  sales: { type: Number, default: 0 },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  sellerName: { type: String, default: "Suguba" },
  dateCreated: { type: Date, default: Date.now() },

  // Mise en avant (Vedette) — demande vendeur — commission 15%
  featuredRequest: {
    status: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none"
    },
    requestedAt: { type: Date, default: null },
    approvedAt: { type: Date, default: null },
    commissionRate: { type: Number, default: 15 },
    homeSlideId: { type: mongoose.Schema.Types.ObjectId, ref: "HomeSlider", default: null }
  },

  // ✅ NOUVEAU — Offre Spéciale — demande vendeur — commission 15%
  specialOfferRequest: {
    status: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none"
    },
    requestedAt: { type: Date, default: null },
    approvedAt: { type: Date, default: null },
    commissionRate: { type: Number, default: 15 },
    homeSlideId: { type: mongoose.Schema.Types.ObjectId, ref: "HomeSlider", default: null }
  }
}, { timestamps: true });

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;












{/*
    import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  brand: { type: String, default: "" },
  price: { type: Number, default: 0 },
  oldPrice: { type: Number, default: 0 },
  catName: { type: String, default: "" },
  catId: { type: String, default: "" },
  subCatId: { type: String, default: "" },
  subCat: { type: String, default: "" },
  thirdsubCat: { type: String, default: "" },
  thirdsubCatId: { type: String, default: "" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  countInStock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isFeatures: { type: Boolean, default: false },
  discount: { type: Number, required: true },
  size: [{ type: String, default: null }],
  sales: { type: Number, default: 0 },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  sellerName: { type: String, default: "Suguba" },
  dateCreated: { type: Date, default: Date.now() },

  // Mise en avant — demande vendeur
  featuredRequest: {
    status: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none"
    },
    requestedAt: { type: Date, default: null },
    approvedAt: { type: Date, default: null },
    commissionRate: { type: Number, default: 15 }, // 15% si mis en avant
    homeSlideId: { type: mongoose.Schema.Types.ObjectId, ref: "HomeSlider", default: null }
  }
}, { timestamps: true });

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
    import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String, required: true }],
  brand: { type: String, default: "" },
  price: { type: Number, default: 0 },
  oldPrice: { type: Number, default: 0 },
  catName: { type: String, default: "" },
  catId: { type: String, default: "" },
  subCatId: { type: String, default: "" },
  subCat: { type: String, default: "" },
  thirdsubCat: { type: String, default: "" },
  thirdsubCatId: { type: String, default: "" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  countInStock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isFeatures: { type: Boolean, default: false },
  discount: { type: Number, required: true },
  size: [{ type: String, default: null }],
  sales: { type: Number, default: 0 },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  sellerName: { type: String, default: "Suguba" },
  dateCreated: { type: Date, default: Date.now() }
}, { timestamps: true });

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;*/}





{/*import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
     name:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    images:[{
        type: String,
        required:true
    }],
    brand:{
        type: String,
       default:" "
    },
     price:{
        type:Number,
        default:0
    },
     oldPrice:{
        type:Number,
        default:0
    },
    catName:{
        type: String,
       default:" "
    },catId:{
        type: String,
       default:" "
    },
    subCatId:{
        type: String,
       default:" "
    },
    subCat:{
        type: String,
       default:" "
    },
     thirdsubCat:{
        type: String,
       default:" "
    },
    thirdsubCatId:{
        type: String,
       default:" "
    },
    category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required:true
        },
      countInStock:{
        type:Number
    },
    rating:{
        type:Number,
        default:0
    },
    isFeatures:{
         type:Boolean,
        default:false
    },
    discount:{
        type:Number,
       required:true
    },
    size:[{
         type: String,
       default:null
    }],
    sales:{
         type:Number, default:0
    },
    dateCreated:{
        type:Date,
         default: Date.now()
    }
},{timestamps:true
    
  });


const ProductModel=mongoose.model("Product",productSchema);

export default ProductModel*/}
/* */