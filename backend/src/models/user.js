import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Provide name"]
        },
        email: {
            type: String,
            required: [true, "provide email"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "provide password"]
        },
        avatar: {
            type: String,
            default: ""
        },
        mobile: {
            type: String,
            default: null
        },
        refresh_token: {
            type: String
        },
        verify_email: {
            type: Boolean,
            default: false
        },
        last_login_date: {
            type: Date
        },
        status: {
            type: String,
            enum: ["Active", "Inactive", "Suspended"],
            default: "Active"
        },
        address_details: [
            {
                type: Schema.Types.ObjectId,
                ref: "Address"
            }
        ],
        shopping_cart: [
            {
                type: Schema.Types.ObjectId,
                ref: "Cart"
            }
        ],
        orderHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Order"
            }
        ],
        forgot_password_otp: {
            type: String
        },
        forgot_password_expiry: {
            type: Date
        },
        role: {
            type: String,
            enum: ["Admin", "User"],
            default: "User"
        }
    },
    { timestamps: true, versionKey: false }
);

// Hash the password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

// Compare the password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const UserModel = model("User", userSchema);
