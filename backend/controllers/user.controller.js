import AppError from "../utils/error.util.js";
import User from "../models/user.Model.js";
import cloudinary from "cloudinary";
import * as fs from "fs";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const cookieOptions = {
   maxAge: 7 * 24 * 60 * 60 * 1000,
   httpOnly: true,
   secure: true,
};
const register = async (req, res, next) => {
   try {
      const { fullName, email, password, role } = req.body;

      if (!fullName || !email || !password) {
         return next(new AppError("All fields are required", 400));
      }

      const userExists = await User.findOne({ email });

      if (userExists) {
         return next(new AppError("/Email already exists", 400));
      }

      const user = new User({
         fullName,
         email,
         password,
         avatar: {
            public_id: email,
            secure_url:
               "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png",
         },
         role,
      });

      // File upload
      if (req.file) {
         console.log(req.file);
         try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
               folder: "LMS",
               width: 250,
               height: 250,
               gravity: "faces",
               crop: "fill",
            });

            if (result) {
               user.avatar.public_id = result.public_id;
               user.avatar.secure_url = result.secure_url;

               //Reomve file from server
               fs.rm(`uploads/${req.file.filename}`, () => {});
            }
         } catch (error) {
            console.error(error);
            return next(
               new AppError(error || "File not uploaded please try again", 500)
            );
         }
      }

      await user.save();

      if (!user) {
         return next(
            new AppError("User registration failed, please try again", 400)
         );
      }
      user.password = undefined;

      const token = await user.generateJWTToken();

      res.cookie("token", token, cookieOptions);

      return res.status(201).json({
         success: true,
         message: "User registration successfully",
         user,
      });
   } catch (error) {
      return next(new AppError(error.message, 400));
   }
};

const logIn = async (req, res, next) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return next(new AppError("All fields are require", 400));
      }

      const user = await User.findOne({
         email,
      }).select("+password");

      const isLoggedIn = (await user?.comparePassword(password)) || false;

      if (!user || !isLoggedIn) {
         return next(new AppError("Email or Password does not match", 400));
      }

      const token = await user.generateJWTToken();
      user.password = undefined;

      res.cookie("token", token, cookieOptions);
      res.status(200).json({
         success: true,
         message: "User logged in successfully",
         user,
      });
   } catch (error) {
      return next(new AppError(error.message, 400));
   }
};

const logOut = (req, res) => {
   res.cookie("token", null, {
      secure: true,
      maxAge: 0,
      httpOnly: true,
   });

   res.status(201).json({
      success: true,
      message: "User logged out successfully",
   });
};

const getProfileDetails = async (req, res, next) => {
   try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      res.status(200).json({
         success: true,
         message: "User profile",
         user,
      });
   } catch (error) {
      return next(new AppError("Failed to fetch user details", 500));
   }
};

const forgotPassword = async (req, res, next) => {
   const { email } = req.body;

   if (!email) {
      return next(new AppError("Email is required", 400));
   }

   const user = await User.findOne({ email });

   if (!user) {
      return next(new AppError("Email not ragistered", 400));
   }

   const resetToken = await user.generateResetPasswordToken();
   console.log("DB data", user.forgotPasswordToken);
   console.log("Reset Token:", resetToken);

   await user.save();

   const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
   console.log(resetPasswordURL);

   const subject = "reset password";
   const message = `You can reset your password by clicking <a href=${resetPasswordURL} target=_blank> reset your password </a>\n If the above link does not work, please copy paste this link in new tab ${resetPasswordURL} \n and If you not requested this kindly ignore this.`;

   try {
      await sendEmail(email, subject, message);

      return res.status(200).json({
         success: true,
         message: `Reset Password token has been send to ${email} successfully`,
      });
   } catch (error) {
      console.log(error);
      user.forgotPasswordExpiry = undefined; //
      user.forgotPasswordToken = undefined; //
      return next(new AppError(error.message, 500));
   }
};

const resetPassword = async (req, res, next) => {
   const { token } = req.params;

   const { password } = req.body;

   const forgotPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

   const user = await User.findOne({
      forgotPasswordToken,
      forgotPasswordExpiry: { $gt: Date.now() },
   });

   if (!user) {
      return next(new AppError("Token is invalid, please try again", 400));
   }

   user.password = password;
   user.forgotPasswordToken = undefined; //
   user.forgotPasswordExpiry = undefined; //

   user.save();

   res.status(200).json({
      success: true,
      message: "Your password changed successfully",
   });
};

const changePassword = async (req, res, next) => {
   const { oldPassword, newPassword } = req.body;
   const { id } = req.user;

   if (!oldPassword || !newPassword) {
      return next(new AppError("ALl field are mandatary", 400));
   }

   const user = await User.findById(id).select("+password");

   if (!user) {
      return next(new AppError("User does not exists", 400));
   }

   const isPasswordValid = await user.comparePassword(oldPassword);

   if (!isPasswordValid) {
      return next(new AppError("Invalid old password", 400));
   }
   user.password = newPassword;

   await user.save();
   user.password = undefined;

   return res.status(200).json({
      success: true,
      message: "Password changed successfully",
   });
};

const updateUser = async (req, res, next) => {
   try {
      const { fullName } = req.body;

      const { id } = req.user;
      const user = await User.findOne({ _id: id });

      console.log(user);

      if (!user) {
         return next(new AppError("User does nor exists", 400));
      }

      if (fullName) {
         user.fullName = fullName;
      }
      if (req.file) {
         await cloudinary.v2.uploader.destroy(user.avatar.public_id);
         try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
               folder: "LMS",
               width: 250,
               height: 250,
               gravity: "faces",
               crop: "fill",
            });

            if (result) {
               user.avatar.public_id = result.public_id;
               user.avatar.secure_url = result.secure_url;

               //Reomve file from server
               fs.rm(`uploads/${req.file.filename}`, () => {});
            }
         } catch (error) {
            console.error(error);
            return next(
               new AppError(error || "File not uploaded please try again", 500)
            );
         }
      }

      await user.save();

      return res.status(200).json({
         success: true,
         message: "User details  updated successfully",
      });
   } catch (error) {
      console.log(error);
      return next(new AppError("Failed to update", 400));
   }
};

export {
   register,
   logIn,
   logOut,
   getProfileDetails,
   forgotPassword,
   resetPassword,
   changePassword,
   updateUser,
};
