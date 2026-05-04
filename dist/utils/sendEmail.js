"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            // user: config.email_user, // your email
            user: "rmdkayesur@gmail.com", // your email
            pass: "kayes1122", // your email password or app password
            // pass: config.email_pass, // your email password or app password
        },
    });
    await transporter.sendMail({
        from: '"Rideshare App" <noreply@rideshare.com>',
        to,
        subject,
        html,
    });
};
exports.sendEmail = sendEmail;
