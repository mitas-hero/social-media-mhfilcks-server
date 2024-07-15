import { Router } from "express";
import { registerUser, signInUser } from "../controllers/user/userAuth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

export const userRouter = Router()


userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

userRouter.route("/sign-in").post(signInUser)