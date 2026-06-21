import {Router} from "express";
import auth from "../middlewares/auth.js";
import { addToCartItemController, getCartItemController,updateCartItemController,deleteCartItemController } from "../controllers/cart.controller.js";




const cartRouter=Router()

cartRouter.post("/ajout-panier",auth,addToCartItemController);
cartRouter.get("/contenu-panier",auth,getCartItemController);
cartRouter.put("/modification-panier",auth,updateCartItemController);
cartRouter.delete("/suppressionion-panier",auth,deleteCartItemController);
export default cartRouter;