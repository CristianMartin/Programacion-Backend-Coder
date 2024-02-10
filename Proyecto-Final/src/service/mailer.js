import 'dotenv/config';
import nodemailer from 'nodemailer';

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.PASSWORD_EMAIL,
        authMethod: 'LOGIN'
    }
})

export const sendEmail = async (email, subject, body) => {
    await transporter.sendMail({
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: subject,
        html: body
    })
}