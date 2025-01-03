import { Router } from "express";
import productRouter from "./productRoute.js";

const router = Router();

router.use("/products", productRouter);

export default router;
