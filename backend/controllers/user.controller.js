import AppError from "../utils/error.util.js";

const cookieOptions = {
   maxAge: 7 * 24 * 60 * 60 * 1000,
   httpOnly: true,
   secure: true,
};

const register = async (req, res, next) => {
   const { fullName, email, password } = req.body;

   if (!fullName || !email || !password) {
      return next(new AppError("All fields are required", 400));
   }

   const userExists = await User.findOne({ email });

   if (!userExists) {
      return next(new AppError("/Email already exists", 400));
   }

   const user = await User.create({
      fullName,
      email,
      password,
      avatar: {
         public_id: email,
         secure_url:
            "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png",
      },
   });

   if (!user) {
      return next(
         new AppError("User registration failed, please try again", 400)
      );
   }

   // TODO: File upload

   await user.save();
   user.password = undefined;

   const token = await user.generateJWTToken();

   res.cookie("token", token, cookieOptions);

   res.status(201).json({
      success: true,
      message: "User registration successfully",
      uaer,
   });
};

const logIn = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return next(new AppError("All fields are require", 400));
      }

      const user = await User.findOne({
         email,
      }).select("+password");

      if (!user || !user.comparePassword(password)) {
         return next(new App("Email or Password does not match", 400));
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
      return next(new App(error.message, 400));
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

const getProfileDetails = async (req, res) => {
   try {
      const userId = req.user.id;
      const user = await User.findbyId(userId);

      res.status(200).json({
         success: true,
         message: "User profile",
         user,
      });
   } catch (error) {
      return next(new App("Failed to fetch user details", 500));
   }
};

export { register, logIn, logOut, getProfileDetails };
