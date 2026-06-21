import {Router} from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createCategory, deleteCategory, getCategories, getCategoriesCount, getCategory, getSubCategoriesCount, removeImageFromCloudinary, updateCategory, uploadImages } from "../controllers/category.controller.js";

const categoryRouter=Router()

categoryRouter.post("/chargement-image",auth,upload.array("images"),uploadImages);
categoryRouter.post("/creation-categorie",auth,createCategory);
categoryRouter.get("/",getCategories);
categoryRouter.get("/nombre-de-categorie",getCategoriesCount);
categoryRouter.get("/nombre-de-sous-categorie",getSubCategoriesCount);
categoryRouter.get("/:id",getCategory);
categoryRouter.delete("/suppression-image",auth,removeImageFromCloudinary);
categoryRouter.delete("/:id",auth,deleteCategory);
categoryRouter.put("/:id",auth,updateCategory);
export default categoryRouter;