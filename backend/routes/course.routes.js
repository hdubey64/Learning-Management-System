import { Router } from "express";
import {
   createCourse,
   getAllCourses,
   getLecturesByCousreId,
   removeCourse,
   updateCourse,
} from "../controllers/course.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.config.js";
import upload from "../middlewares/multer.middleware.js";

const courseRouter = Router();

courseRouter
   .route("/")
   .get(getAllCourses)
   .post(upload.single("thumbnail"), createCourse);

courseRouter
   .route("/:id")
   .get(isLoggedIn, getLecturesByCousreId)
   .put(updateCourse)
   .delete(removeCourse);

export default courseRouter;
