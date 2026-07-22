import { env } from "./config/env.js";
import app from "./app.js";
import http from "http";
import { initializeSocket } from "./socket/index.js";

const server = http.createServer(app);

const io = initializeSocket(server);

server.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
