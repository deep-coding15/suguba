import cartProductModel  from "../models/cartProduct.model.js";
import UserModel from "../models/user.model.js";
import "../models/product.model.js"; 
 import mongoose from "mongoose";

export const updateCartItemController= async(req,res)=>{
    try {
         const userId=req.userId;
        const {id,qty}=req.body;
        if (!id || !qty) {
            return res.status(404).json({ message: "veuillez fournir id et qty", success: false, error: true });   
        }
        const updateCartitem= await cartProductModel.updateOne({_id:id,userId:userId},{
            quantity:qty
        })
     return res.status(200).json({ message: "Panier modifier avec succès",data:updateCartitem, success:true, error:false });  
    }
     catch (error) {
      return res.status(500).json({ message: "ERREUR SURVENU", success: false, error: true });   
    }
}
export const deleteCartItemController= async(req,res)=>{
    try {
         const userId=req.userId;
        const {id,productId}=req.body;
        if (!id) {
            return res.status(404).json({ message: "veuillez fournir id ", success: false, error: true });   
        }
        const deleteCartitem= await cartProductModel.deleteOne({_id:id,userId:userId})
         if (!deleteCartitem) {
            return res.status(404).json({ message: "produit introuvable ", success: false, error: true });   
        }
        const user=await UserModel.findOne({_id:userId})
        const cartItems=user?.shopping_cart;
        const updateCartUser=[...cartItems.slice(0,cartItems.indexOf(productId)),...cartItems.slice(cartItems.indexOf(productId)+1)];
        user.shopping_cart=updateCartUser;
        await user.save();
     return res.status(200).json({ message: "element supprimer avec succès",data:deleteCartitem, success:true, error:false });  
    }
     catch (error) {
      return res.status(500).json({ message: "ERREUR SURVENU", success: false, error: true });   
    }
}
export const getCartItemController = async (req, res) => {
  try {
    

    const cartItem = await cartProductModel.find({
      userId: req.userId
    }).populate("productId");

    console.log("CART ITEMS:", cartItem); // 🔥

    return res.status(200).json({
      data: cartItem,
      success: true,
      error: false
    });

  } catch (error) {
    console.error("ERREUR BACKEND:", error); // 🔥 TRÈS IMPORTANT

    return res.status(500).json({
      message: error.message, // 🔥 AU LIEU DE "ERREUR SURVENU"
      success: false,
      error: true
    });
  }
};
export const addToCartItemController = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, quantity = 1, size = "" } = req.body;
    
    if (!productId) {
      return res.status(404).json({ message: "ID de produit non fourni", success: false, error: true });
    }
    
    const checkItemCart = await cartProductModel.findOne({ userId, productId, size });
    if (checkItemCart) {
      // Si même produit + même taille → augmenter la quantité
      checkItemCart.quantity += quantity;
      await checkItemCart.save();
      return res.status(200).json({ message: "Quantité mise à jour", success: true, error: false });
    }
    
    const cartItem = new cartProductModel({ quantity, userId, productId, size });
    const save = await cartItem.save();
    await UserModel.updateOne({ _id: userId }, { $push: { shopping_cart: productId } });
    
    return res.status(200).json({ message: "Produit ajouté avec succès", data: save, success: true, error: false });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false, error: true });
  }
};
{/*export const addToCartItemController= async(req,res)=>{
    try {
        const userId=req.userId;
        const { productId}=req.body;
        if (!productId) {
            return res.status(404).json({ message: "ERREUR  ID DE PRODUIT NON FOURNI", success: false, error: true });   
        }
        const checkItemCart=await cartProductModel.findOne({
            userId:userId,
            productId:productId
        });
        if (checkItemCart) {
             return res.status(400).json({ message: "  Produit dejá dans le paneir", success: false, error: true }); 
        }
        const cartItem= new cartProductModel({
            quantity:1,
             userId:userId,
            productId:productId
        });
        const save=await cartItem.save();
        const updateCartUser=await UserModel.updateOne({_id:userId},{$push:{
            shopping_cart:productId
        }})
         return res.status(200).json({ message: "Produit ajouter avec succès",data:save, success:true, error:false });  
    } catch (error) {
      return res.status(500).json({ message: "ERREUR SURVENU", success: false, error: true });   
    }
} */}