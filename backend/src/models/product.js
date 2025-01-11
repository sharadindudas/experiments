import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String
        },
        image: {
            type: Array,
            default: []
        },
        category: [
            {
                type: Schema.Types.ObjectId,
                ref: "Category"
            }
        ],
        subCategory: [
            {
                type: Schema.Types.ObjectId,
                ref: "SubCategory"
            }
        ],
        unit: {
            type: String,
            default: ""
        },
        stock: {
            type: Number,
            default: null
        },
        price: {
            type: Number,
            defualt: null
        },
        discount: {
            type: Number,
            default: null
        },
        description: {
            type: String,
            default: ""
        },
        more_details: {
            type: Object,
            default: {}
        },
        publish: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true, versionKey: false }
);

export const ProductModel = model("Product", productSchema);
