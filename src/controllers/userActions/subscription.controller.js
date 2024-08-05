import { isValidObjectId } from "mongoose";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Subscription } from "../../models/Subscribe.model.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ObjectId } from "mongodb";
import { Video } from "../../models/video.model.js";

export const subscribe = asyncHandler(async (req, res) => {
    const { subscriber, channel } = req.body;
    if (!subscriber || !channel) {
        throw new ApiError(400, "All fields are required")
    }
    if (!isValidObjectId(subscriber) || !isValidObjectId(channel)) {
        throw new ApiError(400, "Invalid object id")
    }
    const isSubscribed = await Subscription.findOne({ subscriber, channel })
    // if the user already a subscriber: delete subscription
    if (isSubscribed) {
        const result = await Subscription.deleteOne({ subscriber, channel })
        if (!result) {
            throw new ApiError(500, "Document not deleted")
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, result, "Unsubscribed")
            )
    }
    // create a new subscription document
    const doc = { subscriber, channel }
    const result = await Subscription.create(doc)
    if (!result) {
        throw new ApiError(500, "Something went wrong")
    }
    res
        .status(200)
        .json(
            new ApiResponse(200, result, "Subscribed")
        )
})

export const getSubscribedChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.params?.userId;
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }
    let limit = parseInt(req?.query?.limit);
    if (!limit || typeof (limit) !== "number") {
        throw new ApiError(400, "Must provide limit and it have to be a number")
    }
    // get subscribed channels
    const subscribedChannels = await Subscription.aggregate(
        [
            {
                $match: {
                    subscriber: new ObjectId(userId)
                }
            },
            {
                $limit: 10
            },
            {
                $project: {
                    channel: 1,
                    _id: 0
                }
            },
        ]
    )
    // get subscribed channels videos
    const channelsArr = subscribedChannels.map(c => c.channel);
    const videos = await Video.aggregate(
        [
            {
                $match: {
                    owner: {
                        $in: channelsArr
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerArr"
                }
            },
            {
                $addFields: {
                    channel: {
                        fullName: {
                            $arrayElemAt: ["$ownerArr.fullName", 0]
                        },
                        avatar: {
                            $arrayElemAt: ["$ownerArr.avatar", 0]
                        },
                        username: {
                            $arrayElemAt: ["$ownerArr.username", 0]
                        }
                    }
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
                    likes: {
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
                $unset: ["videolikes", "ownerArr", "videos"]
            }
        ]
    )
    if (!videos) {
        throw new ApiError(404, "videos not found")
    }
    res
        .status(200)
        .json(
            new ApiResponse(200, videos, `total videos = ${videos?.length}`)
        )
})