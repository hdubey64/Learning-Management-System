import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(express.json());

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

app.all("*", (req, res) => {
   res.status(404).json("OOPS!! 404 page not found");
});

export default app;
