import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  getHubs, getAllHubs, createHub, updateHub, deleteHub, toggleHub
} from "../controllers/hub.controller.js";

const hubRouter = Router();

hubRouter.get("/", getHubs);                    // public — liste des hubs actifs
hubRouter.get("/all", auth, getAllHubs);         // admin — tous les hubs
hubRouter.post("/", auth, createHub);           // admin
hubRouter.put("/:id", auth, updateHub);         // admin
hubRouter.delete("/:id", auth, deleteHub);      // admin
hubRouter.patch("/:id/toggle", auth, toggleHub); // admin

export default hubRouter;