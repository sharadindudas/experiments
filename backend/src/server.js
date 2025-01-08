import app from "./app.js";
import { PORT, SERVER_URL } from "./config/config.js";
import { connectMongoDB } from "./utils/mongodb.js";

// Uncaught exception handling
process.on("uncaughtException", (err) => {
    console.error(err.message);
    console.error("Shutting down the server due to unhandled promise rejection");
    process.exit(1);
});

// Connection to server
const server = app.listen(PORT, () => {
    console.log(`Server started at ${SERVER_URL}`);

    // Connection to mongodb
    connectMongoDB();
});

// Unhandled promise rejection handling
process.on("unhandledRejection", (err) => {
    console.error(err.message);
    console.error("Shutting down the server due to unhandled promise rejection");
    server.close(() => process.exit(1));
});
