import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { PostBookmark } from "../../models/bookmark.model.js";
import { ObjectId } from "mongodb";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

export const bookmarkAPost = asyncHandler(async (req, res) => {
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

// get user's bookmark videos
export const getBookmarkedVideos = asyncHandler(async (req, res) => {
    const userId = req.params.userId
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }
    const result = await PostBookmark.aggregate(
        [
            {
                $match: {
                    user: new ObjectId(userId),
                    bookmark: true
                }
            },
            {
                $project: {
                    user: 1,
                    video: 1,
                    bookmark: 1
                }
            },
            {
                $sort: {
                    _id: -1
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "post",
                    foreignField: "_id",
                    as: "postArr"
                }
            },
            {
                $addFields: {
                    post: { $first: "$postArr" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "post.owner",
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
                    from: "postlikes",
                    localField: "post._id",
                    foreignField: "post",
                    as: "postlikes"
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
                $unset: ["videoArr", "ownerArr", "videolikes"]
            }
        ]
    )
    if (!result) {
        throw new ApiError(500, "something went wrong - getLikedVideos")
    }
    res
        .status(200)
        .json(
            new ApiResponse(200, result)
        )
})