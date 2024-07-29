import { Router } from "express";
import { subscribe } from "../controllers/userActions/subscription.controller.js";
import { handleLikeVideo } from "../controllers/userActions/like.controller.js";

export const userActionsRouter = Router()

userActionsRouter.route("/subscribe").post(subscribe)
userActionsRouter.route("/like-video").post(handleLikeVideo)