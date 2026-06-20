import { Router } from "express";
import * as clientController from "./products.client.controller.ts";
import * as adminController from "./products.admin.controller.ts";
import { verifyToken, verifyRole, justDecodeToken } from "@/middlewares/auth.middleware.ts";
import upload from "@/helpers/uploadImage.helper.ts";

export const clientProductRouter = Router();
export const adminProductRouter = Router();

// Client product routes
clientProductRouter.get("/page_list", clientController.getProductsPageList);
clientProductRouter.get("/detail", clientController.getProductDetailBySlugId);
clientProductRouter.post("/post-product", verifyToken, verifyRole("seller", "admin"), upload.array("product_images", 10), clientController.postNewProduct);
clientProductRouter.patch("/update/description", verifyToken, verifyRole("seller", "admin"), clientController.updateProductDescription);
clientProductRouter.get("/my-products", verifyToken, clientController.getMyProductsList);
clientProductRouter.get("/search", clientController.searchProducts);
clientProductRouter.get("/love_status", justDecodeToken, clientController.getLoveStatus);
clientProductRouter.post("/update_love_status", verifyToken, clientController.updateLoveStatus);
clientProductRouter.get("/questions", clientController.getProductQuestions);
clientProductRouter.post("/questions", verifyToken, clientController.postProductQuestion);

// Top client products for homepage listing
clientProductRouter.get("/ending_soon", clientController.getTopEndingSoonProducts);
clientProductRouter.get("/highest_price", clientController.getTopHighestPriceProducts);
clientProductRouter.get("/most_bids", clientController.getTopMostBidProducts);

// Winner view and related product routes
clientProductRouter.get("/detail-for-winner", verifyToken, clientController.getProductDetailForWinner);
clientProductRouter.get("/related", clientController.getRelatedProducts);

// Admin product routes
adminProductRouter.post("/list", adminController.list);
adminProductRouter.post("/number-of-products", adminController.calTotalProducts);
adminProductRouter.get("/detail/:id", adminController.detail);
adminProductRouter.patch("/delete/:id", adminController.deleteProduct);
adminProductRouter.patch("/restore/:id", adminController.restoreProduct);
adminProductRouter.delete("/destroy/:id", adminController.destroyProduct);
