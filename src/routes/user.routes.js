import { Router } from "express";
import { getCurrentUser, registerUser, signInUser, signOutUser } from "../controllers/user/userAuth.controller.js";
// import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const userRouter = Router()


userRouter.route("/register").post(registerUser)
userRouter.route("/sign-in").post(signInUser)
userRouter.route("/sign-out").get(verifyJWT, signOutUser)
userRouter.route("/current-user").get(verifyJWT, getCurrentUser)