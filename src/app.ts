import express from "express";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use(errorMiddleware);
app.use(notFoundMiddleware);

export default app;