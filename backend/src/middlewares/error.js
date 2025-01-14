import { ErrorHandler } from "../utils/handlers.js";

export const errorMiddleware = (err, req, res, next) => {
    // Log the error
    console.error(err);

    // Default error values
    err.message ||= "Internal Server Error Occurred";
    err.statusCode ||= 500;

    // Wrong Mongodb Id error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Invalid jwt error
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid token. Please log in again.";
        err = new ErrorHandler(message, 401);
    }

    // Expired jwt error
    if (err.name === "TokenExpiredError") {
        const message = "Session expired. Please log in again.";
        err = new ErrorHandler(message, 401);
    }

    // Return the response
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};
