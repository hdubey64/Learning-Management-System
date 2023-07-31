import { Router } from "express";
import {
   getAllCourses,
   getLecturesByCousreId,
} from "../controllers/course.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.config.js";

const courseRouter = Router();

courseRouter.route("/").get(getAllCourses);

courseRouter.route("/:id").get(isLoggedIn, getLecturesByCousreId);

export default courseRouter;
