import { Router } from "express";
import { register, verify, login, logout } from "../controllers/authController.js";
import { auth } from "../middlewares/auth.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.patch("/verify", verify);
authRouter.post("/login", login);
authRouter.get("/logout", auth, logout);

export default authRouter;
