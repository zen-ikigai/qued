import mongoose from "mongoose";

let isConnected = false;

/**
 * Establishes a connection to MongoDB if not already connected.
 * Throws an error if the connection fails.
 */
export const connectToDB = async () => {
    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }
    
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_NAME
        });

        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Failed to connect to MongoDB", error);
        // Propagate the error up to the caller
        throw new Error("Failed to connect to MongoDB");
    }
};
