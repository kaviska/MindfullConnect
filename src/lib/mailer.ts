import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"MindfulConnect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code - MindfulConnect',
    html: `
      <h2>Welcome to MindfulConnect</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}