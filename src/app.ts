import express from "express";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import healthRoutes from "./routes/health.route.js";
import authRoutes from "./modules/auth/auth.route.js";
import serverRoutes from "./modules/server/server.route.js";
import channelRoutes from "./modules/channel/channel.route.js";
import messageRoutes from "./modules/message/message.route.js";
import attachmentRoutes from "./modules/attachment/attachmnet.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(helmet());
app.use(express.json());
app.use(cookieParser())

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/servers", serverRoutes);
app.use("/", channelRoutes);
app.use("/", messageRoutes);
app.use("/", attachmentRoutes);

app.use(errorMiddleware);
app.use(notFoundMiddleware);



export default app;