import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";


const router = Router();

router.get("/", (_, res) => {
    res.status(200).json(
        new ApiResponse(true, "Api is running")
    );
});

export default router;