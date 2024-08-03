import { isValidObjectId } from "mongoose";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Subscription } from "../../models/Subscribe.model.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ObjectId } from "mongodb";

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
    const channelsArr = subscribedChannels.map(c => new ObjectId(c.channel))
    res.send(channelsArr)
})