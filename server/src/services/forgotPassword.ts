import crypto from 'crypto';
import { UserModel } from '../models/user';
import sendEmail from '../utils/sendEmail';
import * as bcrypt from 'bcrypt-nodejs';

export const generateResetToken = async (email: string): Promise<void> => {
    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    const otp = crypto.randomBytes(3).toString('hex'); 

    user.otp = otp;
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${otp}`;
    const message = `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`;

    await sendEmail({
        to: user.email,
        subject: 'Password Reset',
        message,
    });
};

export const resetPassword = async (otp: string, newPassword: string): Promise<void> => {
    const user = await UserModel.findOne({ otp });

    if (!user) {
        throw new Error('Invalid OTP');
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.otp = undefined;

    await user.save();
};

const hashPassword = (password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, null, null, (err, hashedPassword) => {
            if (err) reject(err);
            else resolve(hashedPassword);
        });
    });
};