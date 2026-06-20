import { Request, Response } from "express";
import * as SettingsService from "./settings.service.ts";

// Handle fetch auto extend time settings
export async function getAutoExtendTimeSetting(_: Request, res: Response) {
  try {
    const data = await SettingsService.getAutoExtendTimeSetting();
    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (error) {
    console.error("Error fetching auto extend time setting:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}
