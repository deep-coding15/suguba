import {Router} from "express";
import auth from "../middlewares/auth.js";
import { addAddressController, deleteAddressController, getAddressController } from "../controllers/address.controller.js";


const addressRouter=Router()
addressRouter.post("/ajout",auth,addAddressController)
addressRouter.get("/retrait",auth,getAddressController)
addressRouter.delete("/:id",auth,deleteAddressController)

export default addressRouter;