import { ACCESS_TOKEN_SECRET, ENV, FRONTEND_URL, REFRESH_TOKEN_SECRET } from "../config/config.js";
import { UserModel } from "../models/userModel.js";
import verifyEmailTemplate from "../templates/verifyEmail.js";
import { ErrorHandler, TryCatchHandler } from "../utils/handlers.js";
import { sendMail } from "../utils/sendMail.js";
import jwt from "jsonwebtoken";

// Register
export const register = TryCatchHandler(async (req, res, next) => {
    // Get data from request body
    const { name, email, password } = req.body;

    // Validation of data
    if (!name || !email || !password) {
        throw new ErrorHandler("Please provide all the fields", 400);
    }

    // Check if the user already exists in the db or not
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
        throw new ErrorHandler("User already exists", 409);
    }

    // Create a new user
    const newUser = await UserModel.create({
        name,
        email,
        password
    });

    // Remove sensitive data
    newUser.password = undefined;

    // Create a verify user url
    const url = `${FRONTEND_URL}/verify?id=${newUser._id}`;

    // Send the verify email to the user
    const emailResponse = await sendMail({
        email,
        title: "Blinkit | Verification Email",
        body: verifyEmailTemplate({ name, url })
    });

    // Check if the email is sent successfully or not
    if (!emailResponse.success) {
        throw new ErrorHandler(emailResponse.message, 400);
    } else {
        // Return the response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        });
    }
});

// Verify
export const verify = TryCatchHandler(async (req, res, next) => {
    // Get data from request body
    const { id } = req.body;

    // Check if the user exists in the db or not
    const userExists = await UserModel.findById(id);
    if (!userExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Verify the user
    userExists.verify_email = true;
    await userExists.save({ validateBeforeSave: false });

    // Return the response
    res.status(200).json({
        success: true,
        message: "User is verified successfully"
    });
});

// Login
export const login = TryCatchHandler(async (req, res, next) => {
    // Get data from request body
    const { email, password } = req.body;

    // Validation of data
    if (!email || !password) {
        throw new ErrorHandler("Please provide the email and password", 400);
    }

    // Check if the user exists in the db or not
    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Check if the user is active or not
    if (userExists.status !== "Active") {
        throw new ErrorHandler("User is inactive, Please contact to Admin", 409);
    }

    // Check if the user is verified or not
    if (!userExists.verify_email) {
        throw new ErrorHandler("User is not verified", 403);
    }

    // Validation of password
    const isValidPassword = await userExists.comparePassword(password);
    if (!isValidPassword) {
        throw new ErrorHandler("Invalid Credentials", 403);
    }

    // Generate the access and refresh token
    const accessToken = jwt.sign({ id: userExists._id }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: userExists._id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    // Update the refresh token in db
    await UserModel.findByIdAndUpdate(userExists._id, { refresh_token: refreshToken });

    // Remove sensitive data
    userExists.password = undefined;

    // Return the cookie along with response
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    })
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .status(200)
        .json({
            success: true,
            message: "User logged in successfully",
            data: userExists
        });
});

// Logout
export const logout = TryCatchHandler(async (req, res, next) => {
    // Get user id from request decoded (from auth middleware)
    const userid = req.decoded.id;

    // Remove the refresh token from db
    await UserModel.findByIdAndUpdate(userid, { refresh_token: "" }, { new: true, runValidators: false });

    // Remove the cookies and return the response
    res.clearCookie("accessToken").clearCookie("refreshToken").status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});
