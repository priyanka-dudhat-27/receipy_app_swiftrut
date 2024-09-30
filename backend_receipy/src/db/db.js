import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME } from "../constant.js";

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
  try {
    // Check if required environment variables are available
    if (!process.env.MONGODB_URI) {
      throw new Error("Missing MONGODB_URI in environment variables");
    }

    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if unable to connect
        writeConcern: { w: 'majority', wtimeout: 0 }, // Add this line
      }
    );

    console.log(
      `Database Connected Successfully !! \nDB Host : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection FAILED: ", error.message);

    // Provide more specific error details, if available
    if (error.reason && error.reason.message) {
      console.error("Connection error reason: ", error.reason.message);
    }

    process.exit(1); // Exit the process if connection fails
  }
};

export default connectDB;
