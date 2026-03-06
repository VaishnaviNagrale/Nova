import nodemailer from "nodemailer";

export const sendSecurityEmail = async (toEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // simple option
      auth: {
        user: process.env.MY_EMAIL_ID,
        pass: process.env.MY_EMAIL_PASSWORD, // use App Password
      },
    });
    
    const mailOptions = {
      from: `"Nova Security" <${process.env.MY_EMAIL_ID}>`,
      to: toEmail,
      subject: "Security Alert: Multiple Failed Login Attempts",
      html: `
        <h3>Security Alert</h3>
        <p>We detected multiple failed login attempts on your account.</p>
        <p>If this wasn't you, we recommend changing your password immediately.</p>
        <p>If it was you, you can safely ignore this message.</p>
        <br/>
        <small>Nova Team</small>
      `,
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Security email failed:", error.message);
  }
};