import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
   try {
      const { token } = req.cookies;

      if (!token) {
         return next(
            new AppError(
               "Aunauthenticated user is not logged in, Please login again",
               401
            )
         );
      }

      const user = await jwt.verify(token, process.env.SECRET_KEY);

      req.user = user;

      next();
   } catch (error) {
      return next(new AppError(error.message, 401));
   }
};

const authorizedRoles =
   (...roles) =>
   async (req, res, next) => {
      const currentUserRoles = req.user.role;
      if (!roles.includes(currentUserRoles)) {
         return next(
            new AppError("You do not have permission to access.", 403)
         );
      }
      next();
   };

const authorizedSubscriber = async (req, res, next) => {
   const subscription = req.user.subscription;
   const currentUserRoles = req.user.role;

   if (currentUserRoles !== "Admin" && subscription.status !== "active") {
      return next(new AppError("Please subscribe to access this route!", 500));
   }
};

export { isLoggedIn, authorizedRoles, authorizedSubscriber };
