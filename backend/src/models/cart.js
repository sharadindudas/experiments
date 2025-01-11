import { Schema, model } from "mongoose";

const cartSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            default: 1
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true, versionKey: false }
);

export const CartModel = model("Cart", cartSchema);
