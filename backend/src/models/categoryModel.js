import { Schema, model } from "mongoose";

const categorySchema = new Schema(
    {
        name : {
            type : String,
            default : ""
        },
        image : {
            type : String,
            default : ""
        }
    },
    { timestamps: true, versionKey: false }
);

export const CategoryModel = model("Category", categorySchema);
