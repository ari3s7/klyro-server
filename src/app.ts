import express from "express";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import healthRoutes from "./routes/health.route.js"
import authRoutes from "./routes/auth.route.js"

const app = express();

app.use(helmet());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/auth", authRoutes)

app.use(errorMiddleware);
app.use(notFoundMiddleware);

export default app;