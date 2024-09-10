import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";

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


UserSchema.statics.findByCredentials = async function (email: string, password: string) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error('Invalid login credentials');
    }
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials');
    }
}
export const UserModel = mongoose.model("User", UserSchema);