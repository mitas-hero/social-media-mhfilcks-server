import { Router } from "express";
import { getCurrentUser, registerUser, signInUser, signOutUser } from "../controllers/user/userAuth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { updateProfile } from "../controllers/user/user.controller.js";

export const userRouter = Router()


userRouter.route("/register").post(registerUser)
userRouter.route("/sign-in").post(signInUser)
userRouter.route("/sign-out").get(verifyJWT, signOutUser)
userRouter.route("/current-user").get(verifyJWT, getCurrentUser)
userRouter.route("/update-profile/:email").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    updateProfile
)