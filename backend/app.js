import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import courseRouter from "./routes/course.routes.js";
import paymentRouter from "./routes/payment.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
   cors({
      origin: [process.env.FRONTEND_URL],
      credentials: true,
   })
);

app.use(cookieParser());

app.use(morgan("dev"));

app.use("/ping", function (req, res) {
   res.status(200).send("pong");
});

//routes of 3 modules

app.use("/api/v1/user", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/payment", paymentRouter);

app.all("*", (req, res) => {
   res.status(404).json("OOPS!! 404 page not found");
});

app.use(errorMiddleware);
export default app;
