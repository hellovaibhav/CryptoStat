import mongoose from "mongoose";

export const dbConnect = async () => {
    if (mongoose.connection.readyState !== 1) {
        console.log("Connecting to database...");
        try {
            await mongoose.connect(process.env.MONGO_URL);
            console.log("Connected to database");
        } catch (err) {
            console.error("Database connection error:", err);
            throw new Error("Failed to connect to database");
        }
    } else {
        console.log("Database already connected");
    }
};