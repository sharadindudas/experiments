import { TryCatchHandler, ErrorHandler } from "../utils/handlers.js";
import { UserModel } from "../models/user.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// Upload avatar
export const uploadAvatar = TryCatchHandler(async (req, res, next) => {
    // Get data from auth and multer middlewares
    const userid = req.decoded.id;
    const avatarImage = req.file;

    // Validation of image
    if (!avatarImage) {
        throw new ErrorHandler("Please provide the avatar", 400);
    }

    // Check if the user exists in the db or not
    const userExists = await UserModel.findById(userid);
    if (!userExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Upload the avatar image to cloudinary
    const uploadedAvatarImage = await uploadToCloudinary(avatarImage, "avatars");

    // Set the avatar image for the user
    userExists.avatar = uploadedAvatarImage.secure_url;
    await userExists.save({ validateBeforeSave: false });

    // Return the response
    res.status(200).json({
        success: true,
        message: "Uploaded the avatar successfully"
    });
});

// Update user
export const updateUser = TryCatchHandler(async (req, res, next) => {
    // Get data from request body and auth middleware
    const { name, email, mobile } = req.body;
    const userid = req.decoded.id;

    // Update the user
    const updatedUser = await UserModel.findByIdAndUpdate(
        userid,
        {
            ...(name && { name }),
            ...(email && { email }),
            ...(mobile && { mobile })
        },
        { new: true, runValidators: true }
    );

    // Remove sensitive data
    updatedUser.password = undefined;

    // Return the response
    return res.status(200).json({
        success: true,
        message: "Updated user details successfully",
        data: updatedUser
    });
});

// Get user
export const userDetails = TryCatchHandler(async (req, res, next) => {
    // Get data from auth middleware
    const userid = req.decoded.id;

    // Check if the user exists in the db or not
    const userExists = await UserModel.findById(userid).select("-password");
    if (!userExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Return the response
    res.status(200).json({
        success: true,
        message: "Fetched user details successfully",
        data: userExists
    });
});
