import { ApiResponse } from 'dto/response/apiResponse';
import { UserModel } from '../../models/user';
import { sendOtpEmail } from "../../utils/sendEmail"
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

export const generateResetToken = async (email: string) => {
    const user = await UserModel.findOne({ email });
    let response: ApiResponse;

    if (!user) {
        return response = {
            statusCode: 404,
            message: 'User not found',
            data: null,
            error: null
        }
    }

    const otp = generateOtp();
    user.otp = otp;
    await user.save();

    const port = process.env.PORT || 6969;
    const resetUrl = `http://localhost:${port}/reset-password`;
    const message = `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`;

    try {
        await sendOtpEmail(email, otp, message);

        response = {
            statusCode: 200,
            message: 'You requested a password reset. Password reset email sent.',
            data: null,
            error: null
        }
        return response


    } catch (error) {
        throw new Error(error.message)
    }
};

export const resetPassword = async (email: string, otp: string, newPassword: string)=> {
    const user = await UserModel.findOne({ email });

    let response: ApiResponse;

    if (!user) {
        return response = {
            statusCode: 404,
            message: 'User not found',
            data: null,
            error: null
        }
    }

    if (user.otp !== otp) {
        return response = {
            statusCode: 400,
            message: 'Invaild OTP',
            data: null,
            error: null
        }
    }
    if (!validatePassword(newPassword)) {
        return response = {
            statusCode: 400,
            message: 'Password must be at least 6 characters long and contain both letters and numbers',
            data: null,
            error: null
        }
    }

    user.password = newPassword;
    user.otp = undefined;

    try {
        await user.save();

        response = {
            statusCode: 200,
            message: 'Password has been reset successfully',
            data: null,
            error: null
        }
        return response
    } catch (error) {
        throw new Error(error.message)
    }
    
};


