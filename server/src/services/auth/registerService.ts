import { UserModel } from "../../models/user"
import { sendOtpEmail } from "../../utils/sendEmail"
import { ApiResponse } from "dto/response/apiResponse";

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
    let response: ApiResponse<any>
    if (existingUser) {
        response = {
            statusCode: 400,
            message: 'Email đã tồn tại',
            data: null,
            error: 'Không thể đăng ký thành công'
        }
        return response
    }

    if (!validatePassword(password)) {
        response = {
            statusCode: 400,
            message: 'Can not register',
            data: null,
            error: 'Password must be at least 6 characters long and contain both letters and numbers'
        }
        return response
    }

    const otp = generateOtp();
    const role = "customer";
    // Create and save new user
    const newUser = new UserModel({
        fullName,
        email,
        password,
        otp,
        role,
    });
    await newUser.save();
    await sendOtpEmail(email, otp);
    response = {
        statusCode: 200,
        message: 'OTP sent via Email',
        data: null,
        error: null
    }
    return response
};

export const verifyOTP = async (email: string, otp: string) => {
    const user = await UserModel.findOne({ email });
    let response: ApiResponse<any>
    if (!user) {
        response = {
            statusCode: 400,
            message: 'Verify failed',
            data: null,
            error: 'User not found'
        }
        return response
    }

    // Check if OTP is correct and not expired
    if (user.otp === otp) {
        user.isActivated = true;
        user.otp = undefined;
        await user.save();
        response = {
            statusCode: 200,
            message: 'Verify success. Account activated',
            data: null,
            error: null
        }
    } else {
        response = {
            statusCode: 400,
            message: 'Invalid or expired OTP',
            data: null,
            error: null
        }
    }

    return response
};