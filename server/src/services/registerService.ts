import { UserModel } from "../models/user"
import { sendOtpEmail } from "./emailService"
import bcrypt from "bcrypt-nodejs"

const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

export const registerUser = async (fullName: string, email: string, password: string) => {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const otp = generateOtp();

    // Create and save new user
    const newUser = new UserModel({
        fullName,
        email,
        password: hashedPassword,
        otp,
    });
    await newUser.save();

    // Send OTP via email
    await sendOtpEmail(email, otp);
};

// Verify OTP service
export const verifyOtp = async (email: string, otp: string) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }

    // Check if OTP is correct and not expired
    if (user.otp === otp) {
        user.isActivated = true;
        user.otp = undefined;
        await user.save();
    } else {
        throw new Error("Invalid or expired OTP");
    }
};