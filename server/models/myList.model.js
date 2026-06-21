import mongoose from "mongoose";

const myListSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  productTitle: {
    type: String,
    required: true
  },
  images: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  // ✅ FIX: oldPrice et brand ne sont pas toujours fournis (ex: produits offre spéciale)
  oldPrice: {
    type: Number,
    default: 0   // ← était required:true, causait l'erreur "ERREUR SURVENU"
  },
  brand: {
    type: String,
    default: ""  // ← était required:true, causait l'erreur si brand absent
  },
  discount: {
    type: Number,
    default: 0   // ← sécurisé aussi
  }
}, { timestamps: true });

const MyListtModel = mongoose.model("MyList", myListSchema);
export default MyListtModel;




{/*import mongoose from "mongoose";

const myListSchema= new mongoose.Schema({
   productId:{
            type: String,
          required:true
        },
         userId: {
            type: String,
           required:true
        },
        productTitle: {
            type: String,
        required:true
        },
         images: {
            type: String,
           required:true
        },
         rating:{
        type:Number,
       required:true
    },
    price:{
        type:Number,
       required:true
    },
    oldPrice:{
        type:Number,
       required:true
    },
    brand: {
            type: String,
           required:true
        },
    discount:{
        type:Number,
       required:true
    }
   
    },
  {timestamps:true
    
  }
);


const MyListtModel=mongoose.model("MyList",myListSchema);

export default MyListtModel*/}