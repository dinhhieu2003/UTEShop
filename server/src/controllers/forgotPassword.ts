import { Request, Response } from 'express';
import { generateResetToken, resetPassword } from '../services/forgotPassword';

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        await generateResetToken(email);
        res.status(200).send('Password reset email sent');
    } catch (error) {
        // console.error(error);
        res.status(500).send('Error sending password reset email');
    }
};

export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { otp, newPassword } = req.body;
        await resetPassword(otp, newPassword);
        res.status(200).send('Password has been reset successfully');
    } catch (error) {
        // console.error(error);
        res.status(400).send('Invalid OTP or error resetting password');
    }
};

