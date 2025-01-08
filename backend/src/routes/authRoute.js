import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/authController.js";

const authRouter = Router();

authRouter.route("/register").post(registerUser);
authRouter.route("/login").post(loginUser);
authRouter.route("/logout").get(logoutUser);

export default authRouter;
