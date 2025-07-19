import { NextResponse } from 'next/server';
import dbconfig from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// Vercel Scheduled Function (every 5 minutes)
export const config = {
  schedule: '*/5 * * * *',
};

export async function GET() {
  await dbconfig();

  const now = dayjs().utc();
  const targetTime = now.add(30, 'minute');
  const formattedDate = targetTime.format('YYYY-MM-DD');
  const formattedTime = targetTime.format('HH:mm');

  try {
    const sessions = await Session.find({
      date: formattedDate,
      time: formattedTime,
      status: 'confirmed',
    })
      .populate('patientId')
      .populate('counselorId');

    if (!sessions.length) {
      return NextResponse.json({ message: 'No sessions to notify.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const session of sessions) {
      // Skip if email already sent
      if (session.emailSent !== 'no') continue;

      const { patientId, counselorId, zoomLink } = session;

      if (!zoomLink || !patientId?.email || !counselorId?.email) continue;

      const htmlContent = `
        <div style="background-color:#f4f4f7;padding:30px 0;font-family:'Segoe UI',Roboto,sans-serif;">
          <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.1);overflow:hidden;">
            <div style="padding:30px;text-align:center;">
              <h2 style="color:#333333;">🕒 Your Session Starts in 30 Minutes</h2>
              <p style="color:#555;font-size:16px;">Here are the details of your upcoming session:</p>
              <table style="width:100%;margin:20px 0;">
                <tr>
                  <td style="padding:10px;text-align:right;font-weight:bold;color:#333;">Date:</td>
                  <td style="padding:10px;text-align:left;color:#555;">${session.date}</td>
                </tr>
                <tr>
                  <td style="padding:10px;text-align:right;font-weight:bold;color:#333;">Time:</td>
                  <td style="padding:10px;text-align:left;color:#555;">${session.time}</td>
                </tr>
              </table>
              <p style="margin:25px 0;">
                <a href="${zoomLink}" style="display:inline-block;background-color:#007bff;color:#fff;padding:12px 25px;border-radius:6px;text-decoration:none;font-weight:500;font-size:16px;">
                  🔗 Join Zoom Session
                </a>
              </p>
              <hr style="border:none;border-top:1px solid #eaeaea;margin:30px 0;">
              <p style="color:#888;font-size:14px;">If you have any questions, feel free to contact support.</p>
              <p style="color:#aaa;font-size:13px;">— MindfulConnect Team</p>
            </div>
          </div>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: [patientId.email, counselorId.email],
        subject: 'Reminder: Your Session Starts in 30 Minutes',
        html: htmlContent,
      };

      try {
        await transporter.sendMail(mailOptions);
        await Session.findByIdAndUpdate(session._id, { emailSent: 'yes' });
        console.log(`✅ Email sent for session ${session._id}`);
      } catch (error) {
        console.error(`❌ Failed to send email for session ${session._id}:`, error);
      }
    }

    return NextResponse.json({ message: 'Checked sessions and sent reminders where needed.' });
  } catch (err) {
    console.error('❌ Cron job failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
