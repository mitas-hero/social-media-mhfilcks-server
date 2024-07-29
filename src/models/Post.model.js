import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        owner: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        content: {
            type: String,
            required: true,
        },
        media: {
            type: [String]
        }
    },
    { timestamps: true }
)

export const Post = mongoose.model("Post", postSchema)