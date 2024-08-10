import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createPost, deletePost, getPosts, getPostStates, updatePost } from "../controllers/posts/post.controller.js";

export const postRouter = Router()

postRouter.route("/create-post/:userId").post(
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "media", maxCount: 1 }
    ]),
    createPost
)
postRouter.route("/update-post/:id").patch(
    upload.fields([
        { name: "image", maxCount: 1 },
    ]),
    updatePost
)
postRouter.route("/delete-post/:id").delete(deletePost)
postRouter.route("/all-posts").get(getPosts)
postRouter.route("/post-stats/:id").get(getPostStates)