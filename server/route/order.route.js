import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  createOrder, getMyOrders, getOrderById,
  getAllOrders, updateOrderStatus, cancelOrder
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post("/creation-commande", auth, createOrder);
orderRouter.get("/mes-commandes", auth, getMyOrders);
orderRouter.post("/:id/annuler", auth, cancelOrder);      // ✅ NOUVEAU — annulation client
orderRouter.get("/:id", auth, getOrderById);
orderRouter.get("/", auth, getAllOrders);
orderRouter.put("/:id/statut", auth, updateOrderStatus);

export default orderRouter;



{/*import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  createOrder, getMyOrders, getOrderById,
  getAllOrders, updateOrderStatus
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.post("/creation-commande", auth, createOrder);
orderRouter.get("/mes-commandes", auth, getMyOrders);
orderRouter.get("/:id", auth, getOrderById);
orderRouter.get("/", auth, getAllOrders);             // admin
orderRouter.put("/:id/statut", auth, updateOrderStatus); // admin

export default orderRouter;*/}