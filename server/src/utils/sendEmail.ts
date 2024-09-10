import nodemailer from 'nodemailer';

interface SendEmailOptions {
    to: string;
    subject: string;
    message: string;
}

const sendEmail = async (options: SendEmailOptions): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, 
        port: Number(process.env.SMTP_PORT), 
        secure: process.env.SMTP_SECURE === 'true', 
        auth: {
            user: process.env.SMTP_USER, 
            pass: process.env.SMTP_PASS, 
        },
    });

    const mailOptions = {
        from: process.env.SMTP_FROM, 
        to: options.to, 
        subject: options.subject, 
        html: options.message, 
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        // console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

export default sendEmail;
