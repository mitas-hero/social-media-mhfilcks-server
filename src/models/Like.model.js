import mongoose, { Schema } from "mongoose";

const VideoLikeSchema = new Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        video: {
            type: mongoose.Types.ObjectId,
            ref: "Video",
            required: true
        },
        like: {
            type: Boolean,
            required: true
        }
    },
    { timestamps: true }
)

export const VideoLike = mongoose.model("VideoLike", VideoLikeSchema)


const PostLikeSchema = new Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: mongoose.Types.ObjectId,
            ref: "Post",
            required: true
        },
        like: {
            type: Boolean,
            required: true
        }
    }
)

export const PostLike = mongoose.model("PostLike", PostLikeSchema)