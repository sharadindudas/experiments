import express from "express";
import router from "./routes/route.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();
app.use(express.json());

app.use("/api/v1", router);

app.use(errorMiddleware);

export default app;
