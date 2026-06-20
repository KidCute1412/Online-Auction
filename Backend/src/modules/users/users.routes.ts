import { Router } from "express";
import * as clientController from "./users.client.controller.ts";
import * as adminController from "./users.admin.controller.ts";
import { verifyToken } from "@/middlewares/auth.middleware.ts";

export const clientUserRouter = Router();
export const adminUserRouter = Router();
export const adminApplicationRouter = Router();

// Client routes
clientUserRouter.post("/register-seller", verifyToken, clientController.registerSellerRequest);
clientUserRouter.post("/rate", verifyToken, clientController.rateUser);
clientUserRouter.get("/rating-count", clientController.getUserRatingCount);
clientUserRouter.get("/rating-history", clientController.getUserRatingHistory);

// Admin user routes
adminUserRouter.post("/list", adminController.list);
adminUserRouter.post("/number-of-users", adminController.calNumberOfUsers);
adminUserRouter.get("/detail/:user_id", adminController.detail);
adminUserRouter.patch("/edit/:user_id", adminController.editRole);
adminUserRouter.patch("/reset-password/:user_id", adminController.resetPassword);

// Admin application routes
adminApplicationRouter.get("/list", adminController.applications);
adminApplicationRouter.get("/detail/:id", adminController.applicationDetail);
adminApplicationRouter.patch("/edit/:id", adminController.setStatus);
adminApplicationRouter.post("/number-of-applications", adminController.calTotalApplications);
