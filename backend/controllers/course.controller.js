import Course from "../models/course.Model.js";
import AppError from "../utils/error.util.js";

const getAllCourses = async function (req, res, next) {
   try {
      const courses = await Course.find({}).select("-lecture");
      return res.status(200).json({
         success: true,
         message: "All courses",
         courses,
      });
   } catch (error) {
      return next(AppError(error, 500));
   }
};

const getLecturesByCousreId = async function (req, res, next) {
   try {
      const { id } = req.params;

      const course = await Course.findOne({ _id: id });

      if (!course) {
         return next(new AppError("Course not found", 404));
      }

      return res.status(200).json({
         success: true,
         message: "Course lectures fetched successfully",
         lecture: course.lectures,
      });
   } catch (error) {
      console.log("error", error);
      return next(new AppError(error, 500));
   }
};

export { getAllCourses, getLecturesByCousreId };
