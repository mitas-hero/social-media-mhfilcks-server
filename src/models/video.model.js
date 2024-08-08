import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
    {
        video: {
            type: Object,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        thumbnail: {
            type: String
        },
        duration: {
            type: String,
            required: true
        },
        owner: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        assetsDetail: {
            type: Object,
        }
    },
    { timestamps: true }
)


export const Video = mongoose.model("Video", videoSchema) 