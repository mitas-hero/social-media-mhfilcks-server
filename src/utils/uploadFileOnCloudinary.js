import dotenv from "dotenv"
dotenv.config()
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
    cloud_name: 'dquqygs9h',
    api_key: '885459731211326',
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

export const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        console.log("File uploaded on cloudinary:", uploadResult?.secure_url);
        fs.unlinkSync(localFilePath)
        return uploadResult?.secure_url
    } catch (err) {
        console.error("Cloudinary upload error:", err);
    }
}