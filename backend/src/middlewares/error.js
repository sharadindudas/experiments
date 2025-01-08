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

    // Return the response
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};
