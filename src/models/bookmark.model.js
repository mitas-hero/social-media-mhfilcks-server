import mongoose, { Schema } from "mongoose"

const PostBookmarkSchema = new Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: mongoose.Types.ObjectId,
            ref: "Video",
            required: true
        },
        bookmark: {
            type: Boolean,
            required: true
        }
    }
)

export const PostBookmark = mongoose.model("PostBookmark", PostBookmarkSchema)