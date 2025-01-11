import { Router } from "express";
import { verify, login, logout, signup } from "../controllers/auth.js";
import { auth } from "../middlewares/auth.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.patch("/verify", verify);
authRouter.post("/login", login);
authRouter.get("/logout", auth, logout);

export default authRouter;
