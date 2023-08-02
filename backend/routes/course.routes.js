import { Router } from "express";
import {
   createCourse,
   getAllCourses,
   getLecturesByCousreId,
   removeCourse,
   updateCourse,
   addLecturesByCourseId,
   deleteLectureByCourseId,
} from "../controllers/course.controller.js";
import {
   isLoggedIn,
   authorizedRoles,
   authorizedSubscriber,
} from "../middlewares/auth.middleware.config.js";
import upload from "../middlewares/multer.middleware.js";

const courseRouter = Router();

courseRouter
   .route("/")
   .get(getAllCourses)
   .post(
      isLoggedIn,
      authorizedRoles("ADMIN"),
      upload.single("thumbnail"),
      createCourse
   );

courseRouter
   .route("/:id")
   .get(isLoggedIn, authorizedSubscriber, getLecturesByCousreId)
   .put(isLoggedIn, authorizedRoles("ADMIN"), updateCourse)
   .delete(isLoggedIn, authorizedRoles("ADMIN"), removeCourse)
   .post(
      isLoggedIn,
      authorizedRoles("ADMIN"),
      upload.single("lecture"),
      addLecturesByCourseId
   );

courseRouter
   .route("/lecture/:courseId/:lectureId")
   .delete(deleteLectureByCourseId);

export default courseRouter;
