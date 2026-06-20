import { Router } from "express";
import * as clientController from "./categories.client.controller.ts";
import * as adminController from "./categories.admin.controller.ts";

export const clientCategoryRouter = Router();
export const adminCategoryRouter = Router();

// Client routes
clientCategoryRouter.get("/level1", clientController.getAllCategoriesLv1);
clientCategoryRouter.get("/level2/noslug", clientController.getAllCategoriesLv2NoSlug);
clientCategoryRouter.get("/level2", clientController.getAllCategoriesLv2);
clientCategoryRouter.get("/all", clientController.getAll);
clientCategoryRouter.get("/cat2", clientController.getCategoryLv2ById);

// Admin routes
adminCategoryRouter.get("/build-tree", adminController.buildTree);
adminCategoryRouter.post("/create", adminController.createPost);
adminCategoryRouter.post("/number-of-categories", adminController.calTotalCategories);
adminCategoryRouter.post("/list", adminController.list);
adminCategoryRouter.get("/edit/:id", adminController.edit);
adminCategoryRouter.patch("/edit/:id", adminController.editPatch);
adminCategoryRouter.patch("/delete/:id", adminController.deleteCategory);
adminCategoryRouter.patch("/restore/:id", adminController.restoreCategory);
adminCategoryRouter.delete("/destroy/:id", adminController.destroyCategory);
