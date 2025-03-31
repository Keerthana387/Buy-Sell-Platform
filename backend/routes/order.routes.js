import express from "express";
import { createOrder, pendingOrders ,updateOrder, boughtOrders, soldOrders, deliverOrders, checkotp, closetrans} from "../controllers/order.controller.js";

const order_router= express.Router();

order_router.post("/create",createOrder); //create order page
order_router.get("/pending",pendingOrders); //gives pending orders details
order_router.patch("/update/:id",updateOrder);
order_router.get("/bought",boughtOrders);
order_router.get("/sold",soldOrders);
order_router.get("/deliver",deliverOrders);
order_router.post("/otpcheck",checkotp);
order_router.patch("/close",closetrans);

export default order_router;