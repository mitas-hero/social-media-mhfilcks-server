import { isValidObjectId } from "mongoose";
import { ObjectId } from "mongodb"
import { Video } from "../../models/video.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadFileOnCloudinary, uploadVideoOnCloudinary } from "../../utils/uploadFileOnCloudinary.js";
import { VideoLike } from "../../models/Like.model.js";
import { Subscription } from "../../models/Subscribe.model.js";

// .select("title thumbnail likes views createdAt duration owner")
export const getVideos = asyncHandler(async (req, res) => {
    const result = await Video.aggregate([
        {
            $sort: {
                _id: -1
            }
        },
        {
            $lookup: {
                from: "videolikes",
                localField: "_id",
                foreignField: "video",
                as: "videolikes"
            }
        },
        {
            $addFields: {
                likeCount: {
                    $size: {
                        $filter: {
                            input: "$videolikes",
                            as: "likeObj",
                            cond: {
                                $eq: [true, "$$likeObj.like"]
                            }
                        }
                    }
                }
            }
        },
        {
            $unset: "videolikes"
        }
    ])
    if (!result) {
        throw new ApiError(500, "Something went wrong - fetch videos")
    }
    res
        .status(200)
        .json(
            new ApiResponse(200, result)
        )
})

// data for video player page
// 1
export const getVideo = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(id).select("video title")
    res
        .status(200)
        .json(
            new ApiResponse(200, video, "Get a video fetched")
        )
})
// 2
export const getAVideoPageData = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid video id")
    }
    const result = await Video.aggregate([
        [
            {
                $match: {
                    _id: new ObjectId(id)
                }
            },
            // deal with channel data
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "channelObj"
                }
            },
            {
                $set: {
                    channelObj: {
                        $first: "$channelObj"
                    }
                }
            },
            {
                $set: {
                    channel: {
                        channelId: "$channelObj._id",
                        channelName: "$channelObj.fullName",
                        channelAvatar: "$channelObj.avatar"
                    }
                }
            },
            {
                $unset: "channelObj"
            },
            // deal with likes
            {
                $lookup: {
                    from: "videolikes",
                    localField: "_id",
                    foreignField: "video",
                    as: "videolikesArr"
                }
            },
            {
                $addFields: {
                    likeCount: {
                        $size: {
                            $filter: {
                                input: "$videolikesArr",
                                as: "obj",
                                cond: {
                                    $eq: ["$$obj.like", true]
                                }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    unlikeCount: {
                        $size: {
                            $filter: {
                                input: "$videolikesArr",
                                as: "obj",
                                cond: {
                                    $eq: ["$$obj.like", false]
                                }
                            }
                        }
                    }
                }
            },
            // deal with subscriptions
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "owner",
                    foreignField: "channel",
                    as: "subscriberArr"
                }
            },
            {
                $set: {
                    subscriber: {
                        $size: "$subscriberArr"
                    }
                }
            },
            {
                $unset: ["videolikesArr", "subscriberArr", "video"]
            }
        ]
    ])
    if (!result) {
        throw new ApiError(500, "Something went wrong when getAVideoPageData")
    }
    res
        .status(200)
        .json(
            new ApiResponse(400, result[0], "get a video data fetch")
        )
})
// 3
export const getLikeAndSubscribe = asyncHandler(async (req, res) => {
    const videoId = req.params?.id;
    const userId = req.query?.userId;
    if (!isValidObjectId(videoId) || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid object id")
    }
    const videoOwner = await Video.findById(videoId).select("owner -_id")
    if (!videoOwner) {
        throw new ApiError(500, "Something went wrong [video owner not found]")
    }
    const likeObj = await VideoLike.findOne({ user: new ObjectId(userId), video: new ObjectId(videoId) })
    const subscribeObj = await Subscription.findOne({ subscriber: new ObjectId(userId), channel: videoOwner.owner })
    res
        .status(200)
        .json(
            new ApiResponse(200, { likeObj, subscribeObj })
        )
})

// upload a video
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
