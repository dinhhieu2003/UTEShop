import { UserModel } from '../models/user';
import { sendOtpEmail } from "../utils/sendEmail"
import dotenv from "dotenv"

dotenv.config();

const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const validatePassword = (password: string): boolean => {
    // regex for minimum 6 characters, at least 1 letter and 1 number
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    return regex.test(password)
}

export const generateResetToken = async (email: string): Promise<void> => {
    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    const otp = generateOtp();

    user.otp = otp;
    await user.save();

    const port = process.env.PORT || 6969;
    const resetUrl = `http://localhost:${port}/reset-password`;
    const message = `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`;

    await sendOtpEmail(email, otp, message);

};

export const resetPassword = async (otp: string, newPassword: string): Promise<void> => {
    const user = await UserModel.findOne({ otp });

    if (!user) {
        throw new Error('Invalid OTP');
    }
    if (!validatePassword(newPassword)) {
        throw new Error("Password must be at least 6 characters long and contain both letters and numbers")
    }

    user.password = newPassword;
    user.otp = undefined;

    await user.save();
};


