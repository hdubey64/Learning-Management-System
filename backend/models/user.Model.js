import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
   {
      fullName: {
         type: "string",
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
      timestamps: true,
   }
);

userSchema.pre("save", async function (next) {
   try {
      if (!this.isModified("password")) {
         console.log("log: password", this.password);
         return next();
      }

      this.password = await bcrypt.hash(this.password, 10);
      console.log(bcrypt.hash(this.password, 10));
      next();
   } catch (error) {
      console.log(error);
      throw new Error(error.message);
   }
});

userSchema.methods = {
   generateJWTToken: async function () {
      return await jwt.sign(
         {
            id: this._id,
            email: this.email,
            subscription: this.subscription,
            role: this.role,
         },
         process.env.SECRET_KEY,
         {
            expiresIn: process.env.JWTEXPIRY,
         }
      );
   },

   comparePassword: async function (plainTextPassword) {
      return await bcrypt.compare(plainTextPassword, this.password);
   },
};

const User = model("User", userSchema);
export default User;
