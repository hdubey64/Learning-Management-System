import AppError from "../utils/error.util.js";
import User from "../models/user.Model.js";

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

      // TODO: File upload

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

export { register, logIn, logOut, getProfileDetails };
