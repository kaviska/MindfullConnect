import mongoose from "mongoose";

let connection: { isConnected?: number } = {};

export const connectToDB = async () => {
    try {
        if (connection.isConnected) return; // Already connected

        const db = await mongoose.connect(process.env.MONGO as string); // Cast to string
        connection.isConnected = db.connections[0].readyState; // Correct access

        console.log("MongoDB connected successfully");

    } catch (error) {
        throw new Error((error as Error).message); // Proper error handling in TS
    }
}