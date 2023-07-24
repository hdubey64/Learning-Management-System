import { Router } from "express";
import {
   getProfileDetails,
   logIn,
   logOut,
   register,
} from "../controllers/user.controller.js";
const router = Router();

router.post("/ragister", register);
router.post("/login", logIn);
router.get("/logout", logOut);
router.get("/me", getProfileDetails);

export default router;
