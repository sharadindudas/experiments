import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "../config/config.js";

// Connection to cloudinary
export const connectCloudinary = () => {
    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET
    });
};

// Upload to cloudinary
export const uploadToCloudinary = async (image, folder) => {
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

    const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ resource_type: "auto", folder }, (err, res) => {
                return resolve(res);
            })
            .end(buffer);
    });

    return result;
};
