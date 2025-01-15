import { Schema, model } from "mongoose";

const addressSchema = new Schema(
    {
        address_line: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        state: {
            type: String,
            default: ""
        },
        pincode: {
            type: String
        },
        country: {
            type: String
        },
        mobile: {
            type: String,
            default: null
        }
    },
    { timestamps: true, versionKey: false }
);

export const AddressModel = model("Address", addressSchema);
