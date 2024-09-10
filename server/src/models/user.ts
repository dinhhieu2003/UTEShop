import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";

interface IUser extends mongoose.Document {
    fullName: string;
    email: string;
    password: string;
    otp: string;
    address: string;
    isActivated: boolean;
    comparePassword: (password: string) => boolean;
}

const UserSchema = new mongoose.Schema<IUser>({
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
    },
    isActivated: {
        type: Boolean,
        required: false
    }
})

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password: string) {
    return bcrypt.compareSync(password, this.password);
};

export const UserModel = mongoose.model<IUser>("User", UserSchema);