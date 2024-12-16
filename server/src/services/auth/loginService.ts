import { UserModel } from "../../models/user";
import { ApiResponse } from "../../dto/response/apiResponse";
import jwt from "jsonwebtoken";
import { LoginResponse } from "../../dto/response/auth/loginResponse";


export const login = async (email: string, password: string) => {
    const user = await UserModel.findOne({ email} );
    let response: ApiResponse<LoginResponse>;
    if (!user) {
        response = {
            statusCode: 401,
            message: 'Tài khoản hoặc mật khẩu không đúng',
            data: null,
            error: "Đăng nhập không thành công"
        }
        return response;
    }
    const isPasswordMatch = user.comparePassword(password);
    // const isPasswordMatch = user.password === password;
    if (!isPasswordMatch) {
        response = {
            statusCode: 401,
            message: 'Tài khoản hoặc mật khẩu không đúng',
            data: null,
            error: "Đăng nhập không thành công"
        }
        return response;
    }
    response = {
        statusCode: 200,
        message: "Login successfully",
        data: generateTokens(user),
        error: null
    }
    return response;
}

const generateAccessToken = (user: typeof UserModel.prototype) => {
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email, fullName: user.fullName }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

const generateRefreshToken = (user: typeof UserModel.prototype) => {
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email, fullName: user.fullName }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

const generateTokens = (user: typeof UserModel.prototype) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    let loginResponse: LoginResponse = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
            email: user.email,
            fullName: user.fullName,
            address: user.address,
            role: user.role,
        }
    }
    return loginResponse;
}