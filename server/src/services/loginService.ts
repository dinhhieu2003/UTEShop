import { UserModel } from "../models/user";
import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";

export const login = async (email: string, password: string) => {
    const user = await UserModel.findOne({ email} );
    if (!user) {
        throw new Error('Invalid login credentials' );
    }
    // const isPasswordMatch = bcrypt.compareSync(password, user.password);
    const isPasswordMatch = user.password === password;
    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials');
    }
    return generateTokens(user);
}

const generateAccessToken = (user: typeof UserModel.prototype) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

const generateRefreshToken = (user: typeof UserModel.prototype) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

const generateTokens = (user: typeof UserModel.prototype) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken };
}