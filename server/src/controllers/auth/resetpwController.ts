import { Request, Response } from 'express';
import { generateResetToken, resetPassword } from '../../services/auth/resetpwService';

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const forgotResponse = await generateResetToken(email);
        res.status(200).json(forgotResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp, newPassword } = req.body;
        const resetResponse = await resetPassword(email ,otp, newPassword);
        res.status(200).json(resetResponse);
    } catch (error) {
        // console.error(error);
        res.status(400).json({ error: error.message });
    }
};

