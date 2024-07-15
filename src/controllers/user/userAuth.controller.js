import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body
    if (!fullName || !username || !email || !password) {
        throw new ApiError(400, "All Fields Required")
    }
    res.status(200).send(req.files);
})