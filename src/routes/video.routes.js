import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getAVideo, getAVideoPageData, getCurrentUserActionsOfVideo, getVideos, uploadVideo } from "../controllers/video/video.controller.js";

export const videoRouter = Router()

videoRouter.route("/upload-video").post(
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadVideo
)
videoRouter.route("/get-video/:id").get(getAVideo)
videoRouter.route("/get-video-page-data/:id").get(getAVideoPageData)
videoRouter.route("/get-current-user-actions/:id").get(getCurrentUserActionsOfVideo)
videoRouter.route("/get-videos").get(getVideos)