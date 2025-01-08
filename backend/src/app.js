import express from "express";
import cookieParser from "cookie-parser";
import router from "./routes/route.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router);

app.use(errorMiddleware);

export default app;
