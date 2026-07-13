import type { Request, Response} from 'express';
import { asyncHandler } from '../utils/aysncHandler.js';
import { loginSchema, registerSchema } from '../validators/auth.validators.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { login, logout, refresh, register } from '../services/auth.service.js';
import { ApiError } from '../utils/ApiError.js';

export const registerUser = asyncHandler(async(req: Request, res: Response) => {
     const data = registerSchema.parse(req.body);

     const user = await register(data);

     res.status(201).json(
        new ApiResponse(true, "User registered successfully", user)
     );
});

export async function loginUser(req: Request, res: Response) {
   const data = loginSchema.parse(req.body);

   const { accessToken, refreshToken } = await login(data);

   res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
   })

   res.status(200).json(
      new ApiResponse(true, "Login Successful", {
         accessToken
      })
   );
};

export async function refreshAccessToken (req: Request, res: Response){
   const refreshToken = req.cookies.refreshToken;

   if(!refreshToken){
      throw new ApiError(401, "Unauthorized");
   }

   const accessToken  = await refresh(refreshToken);

   res.status(200).json(
      new ApiResponse(true, "Access token refreshed", {
         accessToken,
      })
   );
}

export async function getCurrentUser (req: Request, res:Response) {
   res.status(200).json(
      new ApiResponse(
         true,
         "Current User fetched successfully",
         req.user
      )
   );
}

export async function logoutUser (req: Request, res: Response) {
   const refreshToken = req.cookies.refreshToken;

   if(refreshToken) {
      await logout(refreshToken);
   }

   res.clearCookie("refreshToken");

   res.status(200).json(
      new ApiResponse(true, "Logged out successfully")
   );
}