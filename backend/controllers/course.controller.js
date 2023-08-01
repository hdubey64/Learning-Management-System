import Course from "../models/course.Model.js";
import AppError from "../utils/error.util.js";
import fs from "fs/promises";
import cloudinary from "cloudinary";

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

const createCourse = async (req, res, next) => {
   try {
      const { title, description, cotegory, createdBy } = req.body;

      if (!title || !description || !cotegory || !createdBy) {
         return next(new AppError("All fields are required", 400));
      }

      const course = new Course({
         title,
         description,
         cotegory,
         createdBy,
         thumbnail: {
            public_id: "Dummny",
            SecureUrl: "Dummy",
         },
      });

      if (req.file) {
         try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
               folder: "lms",
            });
            console.log(result);
            if (result) {
               course.thumbnail.public_id = result.public_id;
               course.thumbnail.secure_url = result.secure_url;
            }

            fs.rm(`uploads/${req.file.filename}`);
         } catch (error) {
            return next(new AppError(error.message, 500));
         }
      }
      await course.save();

      if (!course) {
         return next(
            new AppError("course could not created, please try again", 404)
         );
      }

      return res.status(200).json({
         success: true,
         message: "Course created successfully",
         course,
      });
   } catch (error) {
      console.log(error, error.message);
      return next(new AppError(error, 500));
   }
};

const updateCourse = async (req, res, next) => {
   try {
      const { id } = req.params;

      const course = await Course.findByIdAndUpdate(
         id,
         { $set: req.body },
         { runvalidators: true }
      );
      if (!course) {
         return next(new AppError("Course with given id does not exist", 500));
      }

      return res.status(200).json({
         success: true,
         message: "Course updated successfully",
         course,
      });
   } catch (error) {
      return next(new AppError(error.message, 500));
   }
};

const removeCourse = async (req, res, next) => {
   try {
      const { id } = req.params;
      const course = await Course.findOne({ _id: id });

      if (!course) {
         return next(new AppError("Course not found", 500));
      }
      await Course.findByIdAndRemove(id);
      return res.status(200).json({
         success: true,
         message: "Course deleted successfully",
      });
   } catch (error) {
      return next(new AppError(error.message, 500));
   }
};

const addLecturesByCourseId = async (req, res, next) => {
   try {
      const { title, description } = req.body;
      const { id } = req.params;
      const course = await Course.findOne({ _id: id });

      if (!title || !description) {
         return next(new AppError("All fields are required", 500));
      }

      if (!course) {
         return next(new AppError("Course with given id Does not exist", 500));
      }

      const lectureData = {
         title,
         description,
         lecture: {},
      };

      if (req.file) {
         try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
               folder: "lms",
            });
            console.log(result);
            if (result) {
               lectureData.lecture.public_id = result.public_id;
               lectureData.lecture.secure_url = result.secure_url;
            }

            fs.rm(`uploads/${req.file.filename}`);
         } catch (error) {
            return next(new AppError(error.message, 500));
         }
      }
      course.lectures.push(lectureData);

      course.numbersOFLecture = course.lectures.length;

      await course.save();

      return res.status(200).json({
         success: true,
         message: "Lecture successfully added to the list of courses",
         course,
      });
   } catch (error) {
      return next(new AppError(error.message, 500));
   }
};

const deleteLectureByCourseId = async (req, res, next) => {
   try {
      const { courseId, lectureId } = req.params;

      const course = await Course.findOne({ _id: courseId });
      console.log(course.lectures);
      const lecture = course.lectures.filter(
         (e) => e._id.toString() !== lectureId
      );
      // const lectureIdnew = lectures.map((e) => e.lecture);
      course.lectures = lecture;

      course.numbersOFLecture = lecture.length;
      await course.save();

      return res.status(200).json({
         success: true,
         course,
      });
   } catch (error) {
      console.log(error);
      return next(new AppError(error.message, 500));
   }
};

export {
   getAllCourses,
   getLecturesByCousreId,
   createCourse,
   updateCourse,
   removeCourse,
   addLecturesByCourseId,
   deleteLectureByCourseId,
};
