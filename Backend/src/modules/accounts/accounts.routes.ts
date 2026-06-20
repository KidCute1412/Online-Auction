import { Router } from "express";
import * as accountsController from "./accounts.controller.ts";
import * as accountValidate from "@/validates/client/account.validate.ts";
import { verifyToken } from "@/middlewares/auth.middleware.ts";

const route = Router();

// Handle client account registration
route.post("/register", accountValidate.registerPost, accountsController.registerPost);

// Validate user account status
route.get("/verify-account", accountsController.verifyAccount);

// Verify register OTP and finalize register
route.post("/verify-register", accountsController.registerVerifyPost);

// Verify forgot password OTP
route.patch("/verify-forgot-password", accountsController.forgotPasswordVerify);

// Initiate forgot password process
route.post("/forgot-password", accountsController.forgotPassword);

// Reset account password
route.post("/reset-password", accountsController.resetPassword);

// Change password with auth validation
route.patch("/change-password", verifyToken, accountsController.changePassword);

// Confirm and verify password change with OTP
route.post("/verify-change-password", verifyToken, accountsController.verifyChangePassword);

// Perform account login
route.post("/login", accountValidate.loginPost, accountsController.loginPost);

// Authenticate and login with Google OAuth
route.post("/google-login", accountsController.googleLoginPost);

// Log out user session
route.post("/logout", verifyToken, accountsController.logoutPost);

export default route;
