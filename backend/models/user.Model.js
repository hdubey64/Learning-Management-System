import { Schema, model } from "mongoose";

const userSchema = new Schema(
   {
      fullName: {
         typeof: "string",
         required: [true, "Name is required"],
         minLength: [5, "Name must be at least 5 characters"],
         maxLength: [50, "Name should less than 50 characters"],
         lowercase: true,
         trim: true,
      },
      email: {
         type: "string",
         required: [true, "Email is required"],
         lowercase: true,
         trim: true,
         unique: true,
      },
      password: {
         type: "string",
         required: [true, "Password is required"],
         minLength: [8, "Password must be at least 8 characters"],
         select: false,
      },
      avatar: {
         public_id: {
            type: "string",
         },
         secure_url: {
            type: "string",
         },
      },
      role: {
         type: "string",
         enum: ["USER", "ADMIN"],
         default: "USER",
      },
      forgatePasswordToken: String,
      forgatePasswordExpiry: Date,
   },

   {
      timestamps,
   }
);

const User = -model("User, userSchema");

export default User;
