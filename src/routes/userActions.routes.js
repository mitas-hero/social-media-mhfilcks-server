import { Router } from "express";
import { subscribe } from "../controllers/userActions/subscription.controller.js";
import { handleLikePost, handleLikeVideo } from "../controllers/userActions/like.controller.js";
import { commentOnVideo, deleteVideoComment, updateVideoComment } from "../controllers/userActions/comment.controller.js";
import { handleBookmarkPost } from "../controllers/userActions/bookmark.controller.js";

export const userActionsRouter = Router()

userActionsRouter.route("/subscribe").post(subscribe)
userActionsRouter.route("/like-video").post(handleLikeVideo)
userActionsRouter.route("/comment-video").post(commentOnVideo)
userActionsRouter.route("/update-video-comment/:commentId").patch(updateVideoComment)
userActionsRouter.route("/delete-video-comment/:commentId").delete(deleteVideoComment)
// post related
userActionsRouter.route("/like-post").post(handleLikePost)
userActionsRouter.route("/bookmark-post").post(handleBookmarkPost)
// userActionsRouter.route("/")