import { Router } from "express";
import {
   getProfileDetails,
   logIn,
   logOut,
   register,
} from "../controllers/user.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.config.js";
const router = Router();

router.post("/ragister", register);
router.post("/login", logIn);
router.get("/logout", logOut);
router.get("/me", isLoggedIn, getProfileDetails);

export default router;
