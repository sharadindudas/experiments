import { UserModel } from "../models/userModel.js";
import { TryCatchHandler, ErrorHandler } from "../utils/handlers.js";
import jwt from "jsonwebtoken";
import { ENV, JWT_SECRET } from "../config/config.js";

// Register user
export const registerUser = TryCatchHandler(async (req, res, next) => {
    // Get data from request body
    const { name, email, password } = req.body;

    // Check if the user already exists in the db or not
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
        throw new ErrorHandler("User already exists", 409);
    }

    // Create a new user
    const newUser = await UserModel.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is a sample id",
            url: "profile picture url"
        }
    });

    // Remove sensitive data
    newUser.password = undefined;
    newUser.__v = undefined;

    // Return the response
    res.status(201).json({
        success: true,
        message: "User is registered successfully",
        data: newUser
    });
});

// Login user
export const loginUser = TryCatchHandler(async (req, res, next) => {
    // Get data from request body
    const { email, password } = req.body;

    // Check if the user exists in the db or not
    const userExists = await UserModel.findOne({ email });
    if (!userExists) {
        throw new ErrorHandler("User does not exists", 404);
    }

    // Validation of password
    const isValidPassword = await userExists.comparePassword(password);
    if (!isValidPassword) {
        throw new ErrorHandler("Invalid Credentials", 403);
    }

    // Generate jwt token
    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Remove sensitive data
    userExists.password = undefined;
    userExists.__v = undefined;

    // Return the response
    res.cookie("token", token, {
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

// Logout user
export const logoutUser = TryCatchHandler(async (req, res, next) => {
    res.clearCookie("token").status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});
