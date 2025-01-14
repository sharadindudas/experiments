import { Schema, model } from "mongoose";

const subcategorySchema = new Schema(
    {
        name: {
            type: String,
            default: ""
        },
        image: {
            type: String,
            default: ""
        },
        category: [
            {
                type: Schema.Types.ObjectId,
                ref: "Category"
            }
        ]
    },
    { timestamps: true, versionKey: false }
);

export const SubCategoryModel = model("SubCategory", subcategorySchema);
