import { Router } from "express";
import * as profilesController from "./profiles.controller.ts";
import { verifyToken, justDecodeToken } from "@/middlewares/auth.middleware.ts";
import upload from "@/helpers/uploadImage.helper.ts";

export const meRouter = Router();
export const profileRouter = Router();

// Handle client personal info retrieval
meRouter.get("/", verifyToken, profilesController.getMeInfo);

// Handle public profile and edit updates
profileRouter.patch("/edit", upload.single("avatar"), profilesController.editUserProfile);
profileRouter.get("/detail", justDecodeToken, profilesController.getUserProfileDetail);
