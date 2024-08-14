import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()


const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://mahimbabu:mahimbabu_mhmahim@cluster0.jt5df8u.mongodb.net/mhflicks?retryWrites=true&w=majority&appName=Cluster0`)
        console.log("MongoDB 🍃 connected")
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};


export default connectDB