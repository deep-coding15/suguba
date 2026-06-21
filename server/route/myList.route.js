import {Router} from "express";
import auth from "../middlewares/auth.js";
import { addToMyListController, deleteMyListController, getMyListController } from "../controllers/myList.controller.js";



const myListRouter=Router()
myListRouter.post("/ajout-favoris",auth,addToMyListController);
myListRouter.delete("/suppression-favoris/:id",auth,deleteMyListController);
myListRouter.get("/",auth,getMyListController);


export default myListRouter;