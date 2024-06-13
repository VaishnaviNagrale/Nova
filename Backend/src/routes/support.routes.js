import { Router } from "express";
import { createTransport } from "nodemailer";

const router = Router();

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.MY_EMAIL_ID,
        pass: process.env.MY_EMAIL_PASSWORD
    }
});

router.post("/feedback", async (req, res) => {
  const { email, message } = req.body;
  const mailOptions = {
    from: email,
    to: process.env.MY_EMAIL_ID,
    subject: "Feedback Received",
    text: `Feedback from: ${email}\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Feedback sent successfully!" });
  } catch (error) {
    console.error("Error sending feedback email:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send feedback" });
  }
});

router.post("/contact", async (req, res) => {
  const { email, message } = req.body;
  const mailOptions = {
    from: email,
    to: process.env.MY_EMAIL_ID,
    subject: "Contact Message Received",
    text: `Message from: ${email}\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

export default router;