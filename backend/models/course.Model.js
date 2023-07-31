import { Schema, model } from "mongoose";

const courseSchema = new Schema(
   {
      title: {
         type: "string",
         required: [true, "Title is required"],
         minLength: [8, "Title must be at least 8 characters"],
         maxLength: [60, "Title must be at most 60 characters"],
         trim: true,
      },
      description: {
         type: "string",
         required: [true, "Title is required"],
         minLength: [8, "Title must be at least 8 characters"],
         maxLength: [200, "Title must be at most 200 characters"],
      },
      cotegory: {
         type: "string",
         required: [true, "Title is required"],
      },
      thumbnail: {
         public_id: {
            type: "string",
            required: true,
         },
         SecureUrl: {
            type: "string",
            required: true,
         },
      },

      lectures: [
         {
            title: "string",
            description: "string",
            lecture: {
               public_id: {
                  type: "string",
                  required: true,
               },
               SecureUrl: {
                  type: "string",
                  required: true,
               },
            },
         },
      ],
      numbersOFLecture: {
         type: Number,
         default: 0,
      },
      createBy: {
         type: "string",
         required: true,
      },
   },
   {
      timeseries: true,
   }
);

const Course = model("Course", courseSchema);

export default Course;
