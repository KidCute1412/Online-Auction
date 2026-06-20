import express from "express";
import { adminCategoryRouter as categoryRoute } from "@/modules/categories/categories.routes.ts";
import applicationFormRoute from "./application-form.route.ts";
import userRoute from "./user.route.ts";
import { adminProductRouter as productRoute } from "@/modules/products/products.routes.ts";
import * as authMiddleware from "../../middlewares/auth.middleware.ts";

const route = express.Router();

route.use(
  "/api/category",
  authMiddleware.verifyToken,
  authMiddleware.verifyRole("admin"),
  categoryRoute
);

route.use(
  "/api/application-form",
  authMiddleware.verifyToken,
  authMiddleware.verifyRole("admin"),
  applicationFormRoute
);

route.use(
  "/api/user",
  authMiddleware.verifyToken,
  authMiddleware.verifyRole("admin"),
  userRoute
);

route.use(
  "/api/product",
  authMiddleware.verifyToken,
  authMiddleware.verifyRole("admin"),
  productRoute
);

export default route;
