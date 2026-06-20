import * as ProfilesModel from "./profiles.model.ts";
import { uploadToCloudinary } from "@/config/cloud.config.ts";
import fs from "fs";

// Edit user profile details and handle optional avatar upload
export async function editUserProfile(data: any, file?: Express.Multer.File) {
  if (file) {
    const uploadResult = await uploadToCloudinary(file.path, "avatar");
    fs.unlinkSync(file.path);
    data.avatar = uploadResult.secure_url;
  }
  return await ProfilesModel.editUserProfile(data);
}

// Retrieve detailed user profile data and owner verification
export async function getUserProfileDetail(params: {
  username: string;
  user_id: number;
  current_user_id: number | null;
}) {
  return await ProfilesModel.getUserProfileDetail(params);
}
