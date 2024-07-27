import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getAVideo, getVideos, uploadVideo } from "../controllers/video/video.controller.js";

export const videoRouter = Router()

videoRouter.route("/upload-video").post(
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadVideo
)
videoRouter.route("/get-video/:id").get(getAVideo)
videoRouter.route("/get-videos").get(getVideos)