import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getVideo, getAVideoPageData, getLikeAndSubscribe, getVideos, uploadVideo, getAChannelsVideos } from "../controllers/video/video.controller.js";
import { countCommentsOfAVideo, getCommentsOfAVideo } from "../controllers/userActions/comment.controller.js";
import { getLikedVideos } from "../controllers/userActions/like.controller.js";
import { getSubscribedChannelVideos } from "../controllers/userActions/subscription.controller.js";

export const videoRouter = Router()

videoRouter.route("/upload-video").post(
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadVideo
)
videoRouter.route("/get-video/:id").get(getVideo)
videoRouter.route("/get-video-page-data/:id").get(getAVideoPageData)
videoRouter.route("/get-like-and-subscribe/:id").get(getLikeAndSubscribe)
videoRouter.route("/get-videos").get(getVideos)
// channels videos
videoRouter.route("/get-videos/:username").get(getAChannelsVideos)
// video comments
videoRouter.route("/video-comment-count/:id").get(countCommentsOfAVideo)
videoRouter.route("/video-comments/:id").get(getCommentsOfAVideo)
// for user
videoRouter.route("/liked-videos/:userId").get(getLikedVideos)
videoRouter.route("/subscription-videos/:userId").get(getSubscribedChannelVideos)
// for owner
// her using getAChannelsVideos function to get a user's created videos. this function is created for getting a channels videos but here i need to do same job. so reusing this function
videoRouter.route("/get-my-videos/:username").get(getAChannelsVideos)