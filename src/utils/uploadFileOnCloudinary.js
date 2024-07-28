import dotenv from "dotenv"
dotenv.config()
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
    // cloud_name: 'dquqygs9h', // mahfuzulmitas
    // api_key: '885459731211326', // mahfuzulmitas
    cloud_name: 'dpzythyoi', // next-hero
    api_key: '385919312376673', // next-hero  
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        console.log("File uploaded on cloudinary:", uploadResult?.secure_url);
        fs.unlinkSync(localFilePath)
        return uploadResult?.secure_url;
    } catch (err) {
        console.error("Cloudinary upload error:", err);
        fs.unlinkSync(localFilePath)
    }
}
export const uploadVideoOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        console.log("File uploaded on cloudinary:", uploadResult);
        fs.unlinkSync(localFilePath)
        return uploadResult
    } catch (err) {
        console.error("Cloudinary upload error:", err);
        fs.unlinkSync(localFilePath)
    }
}