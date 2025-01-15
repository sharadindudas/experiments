import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { userDetails, updateUser, uploadAvatar } from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";

const userRouter = Router();

userRouter.put("/upload-avatar", auth, upload.single("avatar"), uploadAvatar);
userRouter.patch("/update-profile", auth, updateUser);
userRouter.get("/user-details", auth, userDetails);

export default userRouter;
