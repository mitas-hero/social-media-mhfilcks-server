import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getVideo, getAVideoPageData, getLikeAndSubscribe, getVideos, uploadVideo, getAChannelsVideo } from "../controllers/video/video.controller.js";
import { countCommentsOfAVideo, getCommentsOfAVideo } from "../controllers/userActions/comment.controller.js";

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
videoRouter.route("/get-videos/:username").get(getAChannelsVideo)
// video comments
videoRouter.route("/video-comment-count/:id").get(countCommentsOfAVideo)
videoRouter.route("/video-comments/:id").get(getCommentsOfAVideo)