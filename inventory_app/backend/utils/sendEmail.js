import nodemailer from "nodemailer";

const sendEmail = async (subject, message, sendTo, sentFrom, replyTo = "") => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const options = {
      from: sentFrom,
      to: sendTo,
      replyTo: replyTo || sentFrom,
      subject,
      html: message,
    };

    await transporter.sendMail(options);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw new Error("Email not sent, please try again");
  }
};

export default sendEmail;
