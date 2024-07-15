import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { uploadFileOnCloudinary } from "../../utils/uploadFileOnCloudinary.js";


// register user
export const registerUser = asyncHandler(async (req, res) => {
    // get all userData from req.body 
    const { fullName, username, email, password } = req.body;
    // check if all data exists. if not throw error
    if (!fullName || !username || !email || !password) {
        throw new ApiError(400, "All Fields are Required")
    }
    // check if user already exist
    const existedUser = await User.findOne(
        { $or: [{ email }, { username }] }
    )
    if (existedUser) {
        throw new ApiError(400, "User already exist")
    }
    // handle images
    let avatar;
    if (!req.files?.avatar) {
        throw new ApiError(400, "avatar is required")
    }
    avatar = await uploadFileOnCloudinary(req.files?.avatar[0]?.path)
    let coverImage;
    if (req.files.coverImage) {
        coverImage = await uploadFileOnCloudinary(req.files.coverImage[0]?.path)
    }

    const userData = {
        fullName, username, email, password, avatar,
        coverImage: coverImage || ""
    }
    // create user
    const result = await User.create(userData)
    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(result?._id)
    // find the created user in database
    const createdUser = await User.findByIdAndUpdate(result._id).select("-password -refreshToken")
    if (!createdUser) {
        throw new ApiError(500, "something went wrong when creating user")
    }
    // send response
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(200, createdUser)
        )
})

// sign in user
export const signInUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "email and password is required")
    }
    // find user in db with this email
    const dbUser = await User.findOne({ email })
    if (!dbUser) {
        throw new ApiError(404, "user not found")
    }
    // verify password
    const isPasswordCorrect = await dbUser.isPasswordCorrect(password)
    console.log({ isPasswordCorrect })
    if (!isPasswordCorrect) {
        throw new ApiError(403, "Invalid Password")
    }
    // generate Access And RefreshToken
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(dbUser?._id)

    const user = await User.findById(dbUser?._id).select("-password -refreshToken")
    res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(200, user)
        )
})


// generate access and refresh token
async function generateAccessAndRefreshToken(id) {
    try {
        const user = await User.findById(id)
        if (!user) {
            throw new ApiError(404, "user not found for generating cookie")
        }
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (err) {
        throw new ApiError(500, "something went wrong when generateAccessAndRefreshToken")
    }
}

const cookieOptions = {
    httpOnly: true,
    secure: true
}