import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { FRONTEND_URL } from "./config/config.js";
import router from "./routes/route.js";
import { notfoundMiddleware } from "./middlewares/notfound.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true
    })
);

// Routes
app.use("/api/v1", router);

// Error and not found middlewares
app.use("*", notfoundMiddleware);
app.use(errorMiddleware);

export default app;
