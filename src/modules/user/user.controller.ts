import type{ Request, Response } from "express";
import { getUserProfile } from "./user.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { userSchema } from "./user.validator.js";


export async function getUserProfileController(req: Request, res: Response) {
  const { userId } = userSchema.parse(req.params);

  const user = await getUserProfile(userId);

  if (!user) {
    return res.status(404).json(new ApiResponse(false, "User not found", null));
  }

  res.status(200).json(new ApiResponse(true, "User profile fetched successfully", user));
}