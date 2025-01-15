import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { updateUser, uploadAvatar } from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";

const userRouter = Router();

userRouter.put("/upload-avatar", auth, upload.single("avatar"), uploadAvatar);
userRouter.patch("/update-profile", auth, updateUser);

export default userRouter;
