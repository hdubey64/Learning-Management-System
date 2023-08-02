import "dotenv/config";
import app from "./app.js";
import connectionToDB from "./config/dbConnection.js";
import { v2 as cloudinary } from "cloudinary";
import http from "http";
import Razorpay from "razorpay";
const PORT = process.env.PORT || 5000;

cloudinary.config({
   cloud_name: process.env.CLOUDNIRAY_CLOUD_NAME,
   api_key: process.env.CLOUDNIRAY_API_KEY,
   api_secret: process.env.CLOUDNIRAY_API_SECRET,
});

// app.listen(PORT, async () => {
//    await connectionToDB();
//    console.log(`App is running on http:localhost:${PORT}`);
// });

export const razorpay = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const server = http.createServer(app);

server.listen(PORT || 80, async () => {
   await connectionToDB();
   console.log("Server Listening on: " + PORT);
});
