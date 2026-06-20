import { Router } from "express";
import * as ordersController from "./orders.controller.ts";
import * as authMiddleware from "@/middlewares/auth.middleware.ts";
import upload from "@/helpers/uploadImage.helper.ts";

const route = Router();

// Handle client order invoice creation
route.post("/create", authMiddleware.verifyToken, upload.single("payment_proof"), ordersController.createOrder);

// Fetch order details
route.get("/status", authMiddleware.verifyToken, ordersController.getOrderDetail);

// Fetch order details for seller view
route.get("/seller-view", authMiddleware.verifyToken, ordersController.getSellerOrderView);

// Reject an order
route.post("/reject", authMiddleware.verifyToken, ordersController.rejectOrder);

// Approve order and upload shipping label
route.post("/approve", authMiddleware.verifyToken, upload.single("shipping_label"), ordersController.approveOrder);

export default route;
