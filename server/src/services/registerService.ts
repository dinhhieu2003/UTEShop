import { UserModel } from "../models/user"
import { sendOtpEmail } from "./emailService"

const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const validatePassword = (password: string): boolean => {
    // regex for minimum 6 characters, at least 1 letter and 1 number
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
    return regex.test(password)
}

export const registerUser = async (fullName: string, email: string, password: string) => {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    if (!validatePassword(password)) {
        throw new Error("Password must be at least 6 characters long and contain both letters and numbers")
    }

    // đã hash trước khi save vào MongoDB
    // const salt = await bcrypt.genSaltSync(10);
    // const hashedPassword = await bcrypt.hashSync(password, salt);

    const otp = generateOtp();

    // Create and save new user
    const newUser = new UserModel({
        fullName,
        email,
        password,
        otp,
    });
    await newUser.save();

    await sendOtpEmail(email, otp);
};

export const verifyOTP = async (email: string, otp: string) => {
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