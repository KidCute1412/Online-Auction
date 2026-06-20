import express from "express";
const route = express.Router();

import homeRoute from "./home.route.ts";
import accountRoutes from "@/modules/accounts/accounts.routes.ts";
import { clientCategoryRouter as categoriesRoutes } from "@/modules/categories/categories.routes.ts";
import productsRoutes from "./products.route.ts";
import meRoutes from "./me.route.ts";
import bidRoutes from "@/modules/bids/bids.routes.ts";
import userRotes from "./user.route.ts";
import profileRoutes from "./profile.route.ts";
import settingRoutes from "./setting.route.ts";
import orderRoutes from "./order.route.ts";

import { verifyToken } from "../../middlewares/auth.middleware.ts";
route.use("/", homeRoute);

route.use("/accounts", accountRoutes);

route.use("/api/categories", categoriesRoutes);

route.use("/api/products", productsRoutes);

route.use("/api/me", meRoutes);

route.use("/api/bid", verifyToken, bidRoutes);

route.use("/api/profile", verifyToken, profileRoutes);

route.use("/api/user", userRotes);

route.use("/api/setting", settingRoutes);

route.use("/api/order", verifyToken, orderRoutes);

export default route;
