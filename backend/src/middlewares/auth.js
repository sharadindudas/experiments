import { ACCESS_TOKEN_SECRET } from "../config/config.js";
import { ErrorHandler, TryCatchHandler } from "../utils/handlers.js";
import jwt from "jsonwebtoken";

export const auth = TryCatchHandler(async (req, res, next) => {
    // Get the access token from request cookies
    const { accessToken } = req.cookies;

    // Validation of token
    if (!accessToken) {
        throw new ErrorHandler("Invalid Token or Token not found", 401);
    }

    // Decode the payload
    const decodedPayload = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    // Pass the decoded payload
    req.decoded = decodedPayload;

    // Move to next handler function
    next();
});
