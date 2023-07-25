import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
   const { token } = req.cookies;

   if (!token) {
      return next(
         new AppError(
            "Aunauthenticated user is not logged in, Please login again",
            401
         )
      );
   }

   const userDeatils = await jwt.verify(token, process.env.SECRET_KEY);

   req.user = userDetails;

   next();
};

export { isLoggedIn };
