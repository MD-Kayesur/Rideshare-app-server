import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
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
