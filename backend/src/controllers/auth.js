import { ACCESS_TOKEN_SECRET, ENV, FRONTEND_URL, REFRESH_TOKEN_SECRET } from "../config/config.js";
import { UserModel } from "../models/user.js";
import verifyEmailTemplate from "../templates/verifyEmail.js";
import { ErrorHandler, TryCatchHandler } from "../utils/handlers.js";
import { sendMail } from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import forgotPasswordTemplate from "../templates/forgotPassword.js";

// Signup
export const signup = TryCatchHandler(async (req, res, next) => {
    // Get data from request body
    const { name, email, password } = req.body;

    // Validation of data
    if (!name || !email || !password) {
        throw new ErrorHandler("Please provide all the fields", 400);
    }

    // Check if the user already exists in the db or not
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
        throw new ErrorHandler("User already exists, Please Login", 409);
    }

    // Create a new user
    const newUser = await UserModel.create({ name, email, password });

    // Remove sensitive data
    newUser.password = undefined;

    // Send the verification email to user
    const url = `${FRONTEND_URL}/verify/id?=${newUser._id}`;
    const emailResponse = await sendMail({
        email,
        title: "Binkeyit | Verification Email",
        body: verifyEmailTemplate({
            name,
            url
        })
    });

    // Check if the email is sent successfully or not
    if (!emailResponse.success) {
        throw new ErrorHandler(emailResponse.message, 400);
    } else {
        res.status(201).json({
            success: true,
            message: "User is registered successfully",
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

    // Check if the user is already verified or not
    if (userExists.verify_email) {
        throw new ErrorHandler("User is already verified", 409);
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
        throw new ErrorHandler("User is inactive, Please contact to admin", 403);
    }

    // Check if the user is already verified or not
    if (!userExists.verify_email) {
        throw new ErrorHandler("User is not verified", 403);
    }

    // Validation of password
    const isValidPassword = await userExists.comparePassword(password);
    if (!isValidPassword) {
        throw new ErrorHandler("Invalid Credentials", 403);
    }

    // Remove sensitive data
    userExists.password = undefined;

    // Generate access and refresh token
    const payload = {
        id: userExists._id
    };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    // Store the refresh token in db
    await UserModel.findByIdAndUpdate(userExists._id, { refresh_token: refreshToken }, { new: true, runValidators: false });

    // Set the cookies and return the response
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
    // Get userid from auth middleware
    const userid = req.decoded.id;

    // Remove the refresh token from db
    const user = await UserModel.findById(userid);
    user.refresh_token = undefined;
    await user.save({ validateBeforeSave: false });

    // Remove the cookies and return the response
    res.clearCookie("accessToken").clearCookie("refreshToken").status(200).json({
        success: true,
        message: "User logged out successfully"
    });
});

// Send forgot password otp
export const sendForgotPasswordOtp = TryCatchHandler(async (req, res, next) => {
    // Get data from request body
    const { email } = req.body;

    // Check if the user exists in the db or not
    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Generate the forgot password otp and otp expiry
    const forgotPasswordOtp = crypto.randomInt(100000, 999999).toString().padStart(6, "0");
    const forgotPasswordOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Send the otp to the user via email
    const emailResponse = await sendMail({
        email,
        title: "Binkeyit | Forgot Password Otp",
        body: forgotPasswordTemplate({
            name: userExists.name,
            otp: forgotPasswordOtp
        })
    });

    // Check if the email is sent to the user successfully or not
    if (!emailResponse.success) {
        throw new ErrorHandler(emailResponse.message, 400);
    } else {
        // Store the forgot password otp and otp expiry in db
        userExists.forgot_password_otp = forgotPasswordOtp;
        userExists.forgot_password_expiry = forgotPasswordOtpExpiry.toISOString();
        await userExists.save({ validateBeforeSave: false });

        // Return the response
        res.status(200).json({
            success: true,
            message: "Forgot password email is sent successfully"
        });
    }
});

// Verify forgot password otp
export const verifyForgotPasswordOtp = TryCatchHandler(async (req, res, next) => {
    // Get data from request body
    const { email, otp } = req.body;

    // Validation of data
    if (!email || !otp) {
        throw new ErrorHandler("Please provide all the fields", 400);
    }

    // Check if the user exists in the db or not
    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Validation of forgot password otp and otp expiry
    if (userExists.forgot_password_otp !== otp || new Date(Date.now()) > new Date(userExists.forgot_password_expiry)) {
        throw new ErrorHandler("Invalid Otp or Otp has expired", 403);
    }

    // Remove the forgot password otp and otp expiry from db
    userExists.forgot_password_otp = undefined;
    userExists.forgot_password_expiry = undefined;
    await userExists.save({ validateBeforeSave: false });

    // Return the response
    res.status(200).json({
        success: true,
        message: "Otp is verified successfully"
    });
});

// Forgot password
export const forgotPassword = TryCatchHandler(async (req, res, next) => {
    // Get data from request body
    const { email, newPassword, confirmNewPassword } = req.body;

    // Validation of data
    if (!email || !newPassword || !confirmNewPassword) {
        throw new ErrorHandler("Please provide all the fields", 400);
    }

    // Check if the user exists in the db or not
    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Validation of new password and confirm new password
    if (newPassword !== confirmNewPassword) {
        throw new ErrorHandler("New password and confirm new password does not match", 400);
    }

    // Update the password for the user
    userExists.password = newPassword;
    await userExists.save();

    // Return the response
    res.status(200).json({
        success: true,
        message: "Password is updated successfully"
    });
});
