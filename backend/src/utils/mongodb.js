import mongoose from "mongoose";
import { DATABASE_URL } from "../config/config.js";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(DATABASE_URL, { dbName: "ecommerce" });
        console.log("MongoDB is connected successfully");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
