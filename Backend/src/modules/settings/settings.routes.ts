import { Router } from "express";
import * as settingsController from "./settings.controller.ts";

const route = Router();

// Handle fetch auto extend time settings
route.get("/auto_extend_time", settingsController.getAutoExtendTimeSetting);

export default route;
