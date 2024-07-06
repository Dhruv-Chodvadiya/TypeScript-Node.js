import nodemailer, { TransportOptions } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ,
  port: process.env.SMTP_PORT ,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_MAIL ,
    pass: process.env.SMTP_PASSWORD ,
  },
} as TransportOptions);

interface MailOptions {
  email: string;
  subject: string;
  content: string;
}

export const sendMail = async ({ email, subject, content }: MailOptions) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_MAIL as string,
      to: email,
      subject: subject,
      html: content,
    };

    await transporter.sendMail(mailOptions, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent successfully");
      }
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
  }
};
