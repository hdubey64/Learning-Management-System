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
         const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: "lms",
         });
         console.log(result);
         if (result) {
            course.thumbnail.public_id = result.public_id;
            course.thumbnail.secure_url = result.secure_url;
         }

         fs.rm(`uploads/${req.file.filename}`);
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

const removeCourse = async (req, res, next) => {};

export {
   getAllCourses,
   getLecturesByCousreId,
   createCourse,
   updateCourse,
   removeCourse,
};
