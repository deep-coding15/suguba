import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  getHomeSliders, getAllHomeSliders, createHomeSlider,
  updateHomeSlider, deleteHomeSlider, uploadSliderImage, toggleSlider
} from "../controllers/homeSlider.controller.js";

const homeSliderRouter = Router();

homeSliderRouter.get("/", getHomeSliders);                               // public
homeSliderRouter.get("/all", auth, getAllHomeSliders);                   // admin
homeSliderRouter.post("/", auth, createHomeSlider);                     // admin
homeSliderRouter.post("/upload", auth, upload.array("images"), uploadSliderImage); // admin
homeSliderRouter.put("/:id", auth, updateHomeSlider);                   // admin
homeSliderRouter.patch("/:id/toggle", auth, toggleSlider);              // admin
homeSliderRouter.delete("/:id", auth, deleteHomeSlider);                // admin

export default homeSliderRouter;