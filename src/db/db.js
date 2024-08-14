import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()


const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jt5df8u.mongodb.net/mhflicks?retryWrites=true&w=majority&appName=Cluster0`)
        console.log("MongoDB 🍃 connected")
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};


export default connectDB