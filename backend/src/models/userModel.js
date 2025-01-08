import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            minLength: [8, "Name must be at least 8 characters"],
            maxLength: [100, "Name must not exceed 100 characters"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            trim: true,
            unique: true,
            validate: [validator.isEmail, "Please provide a valid email"]
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minLength: [8, "Password must be at least 8 characters"],
            trim: true
        },
        avatar: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            _id: false
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date
    },
    { timestamps: true }
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
