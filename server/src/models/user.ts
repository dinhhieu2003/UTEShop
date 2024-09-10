import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: false,
        expires: 60 * 5
    },
    address: {
        type: String,
        required: false
    }
})

export const UserModel = mongoose.model("User", UserSchema);