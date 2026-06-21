import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sellerName: { type: String, default: "" },
  productName: { type: String },
  productImage: { type: String },
  price: { type: Number },
  quantity: { type: Number, default: 1 },
  size: { type: String, default: "" },
  subtotal: { type: Number },
  commission: { type: Number },
  commissionRate: { type: Number, default: 10 },
  sellerRevenue: { type: Number },
  status: {
    type: String,
    enum: [
      "en-attente", "emballé", "déposé-hub",
      "en-livraison", "livré", "annulé", "remboursé"
    ],
    default: "en-attente"
  }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderId: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  delivery_address: { type: mongoose.Schema.Types.ObjectId, ref: "address", default: null },

  // ✅ NOUVEAU — retrait en hub (optionnel)
  pickupHub: { type: mongoose.Schema.Types.ObjectId, ref: "Hub", default: null },
  deliveryType: {
    type: String,
    enum: ["livraison", "retrait-hub"],
    default: "livraison"
  },

  paymentId: { type: String, default: "" },
  paymentStatus: {
    type: String,
    enum: ["en-attente", "payé", "échoué", "remboursé"],
    default: "en-attente"
  },
  paymentMethod: { type: String, default: "cash" },
  subTotalAmt: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  totalAmt: { type: Number, default: 0 },
  totalCommission: { type: Number, default: 0 },
  note: { type: String, default: "" },

  status: {
    type: String,
    enum: ["en-attente", "confirmé", "en-livraison", "livré", "annulé"],
    default: "en-attente"
  },

  // ✅ NOUVEAU — annulation
  cancelledAt: { type: Date, default: null },
  cancelReason: { type: String, default: "" },
  canCancelUntil: { type: Date, default: null }, // 2h après création
}, { timestamps: true });

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;



{/*import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sellerName: { type: String, default: "" },
  productName: { type: String },
  productImage: { type: String },
  price: { type: Number },
  quantity: { type: Number, default: 1 },
  size: { type: String, default: "" },
  subtotal: { type: Number },
  commission: { type: Number },       // montant commission Suguba
  commissionRate: { type: Number, default: 10 }, // taux appliqué (10% ou 15%)
  sellerRevenue: { type: Number },    // montant net vendeur
  // Statuts adaptés au modèle Suguba :
  // vendeur emballe → dépose au hub → Suguba livre → argent collecté → reversement fin de mois
  status: {
    type: String,
    enum: [
      "en-attente",     // commande reçue, vendeur n'a pas encore agi
      "emballé",        // vendeur a emballé le produit
      "déposé-hub",     // vendeur a déposé au hub Suguba
      "en-livraison",   // Suguba est en train de livrer
      "livré",          // livraison confirmée
      "annulé",         // annulé
      "remboursé"       // remboursé
    ],
    default: "en-attente"
  }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderId: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  delivery_address: { type: mongoose.Schema.Types.ObjectId, ref: "address" },
  paymentId: { type: String, default: "" },
  paymentStatus: { type: String, enum: ["en-attente", "payé", "échoué", "remboursé"], default: "en-attente" },
  paymentMethod: { type: String, default: "cash" },
  subTotalAmt: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  totalAmt: { type: Number, default: 0 },
  totalCommission: { type: Number, default: 0 },
  note: { type: String, default: "" },
  status: {
    type: String,
    enum: ["en-attente", "confirmé", "en-livraison", "livré", "annulé"],
    default: "en-attente"
  }
}, { timestamps: true });

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;

*/}


{/*
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sellerName: { type: String, default: "" },
  productName: { type: String },
  productImage: { type: String },
  price: { type: Number },
  quantity: { type: Number, default: 1 },
  size: { type: String, default: "" },
  subtotal: { type: Number },
  commission: { type: Number },   // montant commission Suguba
  sellerRevenue: { type: Number }, // montant net vendeur
  status: {
    type: String,
    enum: ["en-attente", "confirmé", "expédié", "livré", "annulé", "remboursé"],
    default: "en-attente"
  }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderId: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  delivery_address: { type: mongoose.Schema.Types.ObjectId, ref: "address" },
  paymentId: { type: String, default: "" },
  paymentStatus: { type: String, enum: ["en-attente", "payé", "échoué", "remboursé"], default: "en-attente" },
  paymentMethod: { type: String, default: "cash" },
  subTotalAmt: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  totalAmt: { type: Number, default: 0 },
  totalCommission: { type: Number, default: 0 },
  note: { type: String, default: "" },
  status: {
    type: String,
    enum: ["en-attente", "confirmé", "expédié", "livré", "annulé"],
    default: "en-attente"
  }
}, { timestamps: true });

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;*/}






{/*import mongoose from "mongoose";

const orderSchema= new mongoose.Schema({
    userId: {
            type:mongoose.Schema.ObjectId,
                 ref:"User"
    },

     orderId:{
        type: String,
        required:[true,"Provide orderId"],
        unique:true
    },
     productId:{
                type:mongoose.Schema.ObjectId,
                ref:"product"
            }, 

    product_details:{
        type: String,
        image:Array
    },
     paymentId:{
        type:String,
        default:""
    },
     paymentStatus:{
        type:String,
        default:""
    },
     delivery_address: {
            type:mongoose.Schema.ObjectId,
            ref:"address"
        },
        subTotalAmt:{
        type:Number,
        default:0
    },
    TotalAmt:{
        type:Number,
        default:0
    }
},
  {timestamps:true}
);


const orderModel=mongoose.model("order",orderSchema);

export default orderModel*/}