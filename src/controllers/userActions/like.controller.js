import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { VideoLike } from "../../models/Like.model.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const handleLikeVideo = asyncHandler(async (req, res) => {
    const { user, video, like } = req.body;
    // validate all data
    if (!user || !video || (typeof like !== "boolean")) {
        throw new ApiError(400, "All fields are required")
    }
    if (!isValidObjectId(user) || !isValidObjectId(video)) {
        throw new ApiError(400, "Invalid object id")
    }
    // check is like document exists with this user and video or not
    const existedLikeDoc = await VideoLike.findOne({ user, video })

    // if the like document does not exists: create a new Like document with the value of like from req.body
    // Note: user clicks on like button or unlike button, request will come here and execute this statement
    if (!existedLikeDoc) {
        const result = await VideoLike.create({
            user, video, like
        })
        if (!result) {
            throw new ApiError(500, "Something went wrong, when like the video")
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, result, `Like document created with like = ${like}`)
            )
    }
    // if like document and the value is same delete the document
    if ((like && existedLikeDoc?.like) || (!like && !existedLikeDoc?.like)) {
        const deleteResult = await VideoLike.deleteOne({ video, user })
        return res
            .status(200)
            .json(new ApiResponse(200, deleteResult, "Like document deleted"))
    }
    // update the like document with the value of like from req.body
    const updateResult = await VideoLike.updateOne(
        { video, user },
        { $set: { like } }
    )
    if (!updateResult) {
        throw new ApiError(500, "Something went wrong, when like the video")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, updateResult, `Like status updated, like = ${like}`)
        )
})