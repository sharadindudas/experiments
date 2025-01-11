import { ACCESS_TOKEN_SECRET } from "../config/config.js";
import { ErrorHandler, TryCatchHandler } from "../utils/handlers.js";
import jwt from "jsonwebtoken";

export const auth = TryCatchHandler(async (req, res, next) => {
    // Validation of access token
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        throw new ErrorHandler("Please provide a token", 400);
    }

    // Decode the payload
    const decodedPayload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    // Send the decoded payload
    req.decoded = decodedPayload;

    // Move to next handler function
    next();
});
