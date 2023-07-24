import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectionToDB = async () => {
   try {
      const { connection } = await mongoose.connect(
         process.env.MONGO_URI || "mongodb://localhost:27017/LMSDB"
      );
      if (connection) {
         console.log(`Connected To MOngoDB: ${connection.host}`);
      }
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
};

export default connectionToDB;
