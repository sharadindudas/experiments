import app from "./app.js";
import { PORT, SERVER_URL } from "./config/config.js";
import { connectMongoDB } from "./utils/mongodb.js";

app.listen(PORT, () => {
    console.log(`Server started at ${SERVER_URL}`);

    // Connection to mongodb
    connectMongoDB();
});
