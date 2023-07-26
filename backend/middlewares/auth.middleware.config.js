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

export { isLoggedIn };
