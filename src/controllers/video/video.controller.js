import { Video } from "../../models/video.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadFileOnCloudinary, uploadVideoOnCloudinary } from "../../utils/uploadFileOnCloudinary.js";

// .select("title thumbnail likes views createdAt duration owner")
export const getVideos = asyncHandler(async (req, res) => {
    const result = await Video.find().sort({ _id: -1 });
    res
        .status(200)
        .json(
            new ApiResponse(200, result)
        )
})

export const getAVideo = asyncHandler(async (req, res) => {
    const id = req.params.id
    const video = await Video.findById(id)
    res
        .status(200)
        .json(
            new ApiResponse(200, video)
        )
})

export const uploadVideo = asyncHandler(async (req, res) => {
    const { title, duration, description, owner } = req.body
    if (!title || !duration || !description || !owner) {
        throw new ApiError(400, "all fields are required")
    }
    if (!req.files?.video || !req.files?.thumbnail) {
        throw new ApiError(400, "video and thumbnail is required")
    }
    const video = await uploadVideoOnCloudinary(req.files.video[0].path)
    const thumbnail = await uploadFileOnCloudinary(req.files.thumbnail[0].path)
    // make document
    const doc = {
        title, duration, description, owner, video, thumbnail
    }
    const result = await Video.create(doc)
    if (!result) {
        throw new ApiError(500, "something went wrong when video uploading")
    }
    res
        .status(200)
        .json(
            new ApiResponse(200, result, "video created")
        )
})
