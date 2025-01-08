import { Router } from "express";
import productRouter from "./productRoute.js";
import authRouter from "./authRoute.js";

const router = Router();

router.use("/products", productRouter);
router.use("/auth", authRouter);

export default router;
