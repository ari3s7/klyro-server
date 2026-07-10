import express from "express";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(express.json());

app.get("/health", (_, res) => {
    res.send("API is running")
});

export default app;