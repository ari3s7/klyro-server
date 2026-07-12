import type { Request, Response} from 'express';
import { asyncHandler } from '../utils/aysncHandler.js';
import { loginSchema, registerSchema } from '../validators/auth.validators.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { login, register } from '../services/auth.service.js';

export const registerUser = asyncHandler(async(req: Request, res: Response) => {
     const data = registerSchema.parse(req.body);

     const user = await register(data);

     res.status(201).json(
        new ApiResponse(true, "User registered successfully", user)
     );
});

export async function loginUser(req: Request, res: Response) {
   const data = loginSchema.parse(req.body);

   const tokens = await login(data);

   res.status(200).json(
      new ApiResponse(true, "Login Successful", tokens)
   );
};