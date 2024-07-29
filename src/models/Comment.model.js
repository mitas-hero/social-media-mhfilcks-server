import mongoose, { Schema } from "mongoose";

const VideoCommentSchema = new Schema(
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
        comment: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
)

export const VideoComment = mongoose.model("VideoComment", VideoCommentSchema)


const PostCommentSchema = new Schema(
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
        comment: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
)

export const PostComment = mongoose.model("PostComment", PostCommentSchema)


