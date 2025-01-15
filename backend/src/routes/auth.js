import { Router } from "express";
import { verify, login, logout, signup, sendForgotPasswordOtp, verifyForgotPasswordOtp, forgotPassword } from "../controllers/auth.js";
import { auth } from "../middlewares/auth.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.patch("/verify", verify);
authRouter.post("/login", login);
authRouter.post("/logout", auth, logout);
authRouter.post("/forgot-password/send-otp", sendForgotPasswordOtp);
authRouter.post("/forgot-password/verify-otp", verifyForgotPasswordOtp);
authRouter.patch("/forgot-password", forgotPassword);

export default authRouter;
