import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadFileOnCloudinary } from "../../utils/uploadFileOnCloudinary.js";

export const updateProfile = asyncHandler(async (req, res) => {
    const email = req.params?.email
    let updateData = {}

    if (req.body?.fullName) {
        updateData.fullName = req.body?.fullName
    }
    if (req.files?.avatar) {
        const avatar = await uploadFileOnCloudinary(req.files?.avatar[0]?.path)
        updateData.avatar = avatar
    }
    if (req.files?.coverImage) {
        const coverImage = await uploadFileOnCloudinary(req.files?.coverImage[0]?.path)
        updateData.coverImage = coverImage
    }

    const result = await User.updateOne({ email }, {
        $set: updateData
    })
    if (!result) {
        throw new ApiError(500, "Something went wrong when updating user profile")
    }
    res
        .status(200)
        .json(
            new ApiResponse(200, result, "Profile updated")
        )
})