import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a product name"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Please provide a product description"],
            trim: true
        },
        price: {
            type: Number,
            required: [true, "Please provide a product price"]
        },
        category: {
            type: String,
            required: [true, "Please provide a product category"],
            trim: true
        },
        images: [
            {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                },
                _id: false
            }
        ],
        stock: {
            type: Number,
            default: 1
        },
        ratings: {
            type: Number,
            default: 0
        },
        reviews: [
            {
                name: {
                    type: String,
                    required: true
                },
                rating: {
                    type: Number,
                    required: true
                },
                comment: {
                    type: String,
                    required: true
                }
            }
        ],
        numOfReviews: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

export const ProductModel = model("Product", productSchema);
