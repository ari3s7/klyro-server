import express from "express";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(errorMiddleware);

export default app;