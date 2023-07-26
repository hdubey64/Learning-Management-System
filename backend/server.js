import "dotenv/config";
import app from "./app.js";
import connectionToDB from "./config/dbConnection.js";
import { v2 as cloudinary } from "cloudinary";
const PORT = process.env.PORT || 5000;

cloudinary.config({
   cloud_name: process.env.CLOUDNIRAY_CLOUD_NAME,
   api_key: process.env.CLOUDNIRAY_API_KEY,
   api_secret: process.env.CLOUDNIRAY_API_SECRET,
});

app.listen(PORT, async () => {
   await connectionToDB();
   console.log(`App is running on http:localhost:${PORT}`);
});
