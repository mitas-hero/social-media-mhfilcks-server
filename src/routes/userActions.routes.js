import { Router } from "express";
import { subscribe } from "../controllers/userActions/subscription.controller.js";
import { likeAPost, LikeAVideo } from "../controllers/userActions/like.controller.js";
import { commentOnPost, commentOnVideo, deletePostComment, deleteVideoComment, updatePostComment, updateVideoComment } from "../controllers/userActions/comment.controller.js";
import { bookmarkAPost } from "../controllers/userActions/bookmark.controller.js";

export const userActionsRouter = Router()

userActionsRouter.route("/subscribe").post(subscribe)
userActionsRouter.route("/like-video").post(LikeAVideo)
userActionsRouter.route("/comment-video").post(commentOnVideo)
userActionsRouter.route("/update-video-comment/:commentId").patch(updateVideoComment)
userActionsRouter.route("/delete-video-comment/:commentId").delete(deleteVideoComment)
// post related
userActionsRouter.route("/like-post").post(likeAPost)
userActionsRouter.route("/bookmark-post").post(bookmarkAPost)
userActionsRouter.route("/comment-post").post(commentOnPost)
userActionsRouter.route("/update-post-comment/:commentId").patch(updatePostComment)
userActionsRouter.route("/delete-post-comment/:commentId").delete(deletePostComment)