import { Router } from "express";
import {
   getProfileDetails,
   logIn,
   logOut,
   register,
   forgotPassword,
   resetPassword,
   changePassword,
   updateUser,
} from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.config.js";
import upload from "../middlewares/multer.middleware.js";
const userRouter = Router();

userRouter.post("/register", upload.single("avatar"), register);
userRouter.post("/login", logIn);
userRouter.get("/logout", logOut);
userRouter.get("/me", isLoggedIn, getProfileDetails);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.post("/change-password", isLoggedIn, changePassword);
userRouter.put("/update/:id", isLoggedIn, upload.single("avatar"), updateUser);

export default userRouter;
