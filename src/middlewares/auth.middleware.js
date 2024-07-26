import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    const accessToken = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1]
    // console.log(accessToken)
    if (!accessToken) {
        console.log("Please provide access token")
        throw new ApiError(401, "where is your token???")
    }
    jwt.verify(accessToken, process.env.ACCESS_TOKE_SECRET, (err, decoded) => {
        if (err) {
            console.log("Token verify error:", err)
            throw new ApiError(401, "Token is not valid")
        }
        // console.log(decoded)
        req.user = decoded
        next()
    })
})