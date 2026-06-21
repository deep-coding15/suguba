import { Router } from "express";
import { subscribeNewsletter, getAllSubscribers } from "../controllers/newsletter.controller.js";
import auth from "../middlewares/auth.js";

const newsletterRouter = Router();
newsletterRouter.post("/inscription", subscribeNewsletter);
newsletterRouter.get("/liste", auth, getAllSubscribers); // admin
export default newsletterRouter;