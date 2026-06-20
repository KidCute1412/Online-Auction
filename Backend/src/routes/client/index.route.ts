import express from "express";
const route = express.Router();

import homeRoute from "./home.route.ts";
import accountRoutes from "@/modules/accounts/accounts.routes.ts";
import { clientCategoryRouter as categoriesRoutes } from "@/modules/categories/categories.routes.ts";
import { clientProductRouter as productsRoutes } from "@/modules/products/products.routes.ts";
import { meRouter as meRoutes } from "@/modules/profiles/profiles.routes.ts";
import bidRoutes from "@/modules/bids/bids.routes.ts";
import { clientUserRouter as userRotes } from "@/modules/users/users.routes.ts";
import { profileRouter as profileRoutes } from "@/modules/profiles/profiles.routes.ts";
import settingRoutes from "./setting.route.ts";
import orderRoutes from "@/modules/orders/orders.routes.ts";

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
