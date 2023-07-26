import { Router } from "express";
import {
   getProfileDetails,
   logIn,
   logOut,
   register,
} from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.config.js";
import upload from "../middlewares/multer.middleware.js";
const router = Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", logIn);
router.get("/logout", logOut);
router.get("/me", isLoggedIn, getProfileDetails);

export default router;
