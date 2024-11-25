import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config();

export const sendOtpEmail = async (email: string, otp: string, message: string = "") => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for registration",
        html: `Your OTP code is: ${otp}</p>${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Failed to send email:", error);
    }
};


/**
 * Gửi email với các thông tin tùy chỉnh
 * @param to Email người nhận
 * @param subject Tiêu đề email
 * @param html Nội dung HTML của email
 * @param text (Tùy chọn) Nội dung văn bản thuần
 */
export const sendEmail = async (
    to: string,
    subject: string,
    html: string,
    text?: string
) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
    }
};