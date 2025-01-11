import { Schema, model } from "mongoose";

const orderSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        orderId: {
            type: String,
            required: [true, "Provide orderId"],
            unique: true
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product"
        },
        product_details: {
            name: String,
            image: Array
        },
        paymentId: {
            type: String,
            default: ""
        },
        payment_status: {
            type: String,
            default: ""
        },
        delivery_address: {
            type: Schema.Types.ObjectId,
            ref: "Address"
        },
        subTotalAmt: {
            type: Number,
            default: 0
        },
        totalAmt: {
            type: Number,
            default: 0
        },
        invoice_receipt: {
            type: String,
            default: ""
        }
    },
    { timestamps: true, versionKey: false }
);

export const OrderModel = model("Order", orderSchema);
