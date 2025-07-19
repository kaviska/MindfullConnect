// src/app/api/session/send-reminder/route.ts
import { NextResponse } from 'next/server';
import dbconfig from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export async function GET() {
  await dbconfig();

  const now = dayjs().utc();
  const targetTime = now.add(30, 'minute');
  const formattedDate = targetTime.format("YYYY-MM-DD");
  const formattedTime = targetTime.format("HH:mm");

  // Get sessions 30 min from now
  const sessions = await Session.find({
    date: formattedDate,
    time: formattedTime,
    emailSent: "no",
    status: "confirmed"
  }).populate('patientId').populate('counselorId');

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  for (const session of sessions) {
    const { patientId, counselorId, zoomLink } = session;

    if (!zoomLink) continue;

    const patientEmail = patientId.email;
    const counselorEmail = counselorId.email;

    const htmlContent = `
      <div style="font-family:sans-serif;">
        <h2>📅 Your session is starting soon!</h2>
        <p><strong>Date:</strong> ${session.date}</p>
        <p><strong>Time:</strong> ${session.time}</p>
        <p>Join your session using the Zoom link below:</p>
        <a href="${zoomLink}" style="background-color:#007bff;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">Join Zoom Session</a>
        <p>Best regards,<br/>MindfulConnect Team</p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: [patientEmail, counselorEmail],
      subject: "Reminder: Your Session Starts in 30 Minutes",
      html: htmlContent
    };

    try {
      await transporter.sendMail(mailOptions);
      await Session.findByIdAndUpdate(session._id, { emailSent: "yes" });
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  }

  return NextResponse.json({ message: "Checked sessions and sent reminders." });
}
