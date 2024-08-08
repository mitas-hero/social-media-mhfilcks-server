import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { PostBookmark } from "../../models/bookmark.model.js";
import { ObjectId } from "mongodb";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

export const handleBookmarkPost = asyncHandler(async (req, res) => {
    const { user, post, bookmark } = req.body;
    if (!user || !post || (typeof bookmark !== "boolean")) {
        throw new ApiError(400, "All fields are required")
    }
    if (!isValidObjectId(user) || !isValidObjectId(post)) {
        throw new ApiError(400, "Invalid object id")
    }
    // check is bookmark document exists with this user and video or not
    const existedBookmarkDoc = await PostBookmark.findOne({ user, post })
    // if bookmark doc already exists, delete the document;
    if (existedBookmarkDoc) {
        const result = await PostBookmark.deleteOne({ post: new ObjectId(post), user: new ObjectId(user) })
        if (!result) {
            throw new ApiError(400, "bookmark not deleted")
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, result, "bookmark removed")
            )
    }
    // if bookmark doc doesn't exists create a new doc 
    const doc = {
        post, user, bookmark: true
    }
    const result = await PostBookmark.create(doc)
    if (!result) {
        throw new ApiError(400, "something went wrong when creating bookmark doc")
    }
    res
        .status(200)
        .json(
            new ApiResponse(200, result, "bookmarked this post")
        )
})