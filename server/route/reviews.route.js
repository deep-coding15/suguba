import { Router } from "express";
import { createReview, getReviewsByProduct } from "../controllers/reviews.controller.js";
import auth from "../middlewares/auth.js";

const reviewRouter = Router();

reviewRouter.post("/creation-avis", auth, createReview);
reviewRouter.get("/:productId", getReviewsByProduct);

export default reviewRouter;