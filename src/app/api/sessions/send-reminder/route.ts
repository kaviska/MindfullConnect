import { NextResponse } from 'next/server';
import dbconfig from '@/lib/db';
import Session from '@/models/Session';
import User from '@/models/User';
import Counselor from '@/models/Counselor';
import nodemailer from 'nodemailer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Vercel Scheduled Function (every 5 minutes)
export const config = {
  schedule: '*/5 * * * *',
};

export async function GET() {
  await dbconfig();

  // Set timezone to Sri Lanka (Asia/Colombo)
  const sriLankaTimezone = 'Asia/Colombo';
  
  const now = dayjs().tz(sriLankaTimezone);
  const thirtyMinutesLater = now.add(30, 'minute');
  const formattedDate = now.format('YYYY-MM-DD');

  // Add debugging with Sri Lanka timezone
  console.log('🔍 Current Sri Lanka time:', now.format());
  console.log('🔍 30 minutes later:', thirtyMinutesLater.format());
  console.log('🔍 Searching for date:', formattedDate);
  console.log('🔍 Timezone:', sriLankaTimezone);

  try {
    // Get all confirmed sessions for today with emailSent = 'no' or undefined
    const allSessionsToday = await Session.find({
      date: formattedDate,
      status: 'confirmed',
      $or: [
        { emailSent: 'no' },
        { emailSent: { $exists: false } },
        { emailSent: null }
      ]
    })
      .populate({
        path: 'patientId',
        model: 'User',
        select: 'fullName email'
      })
      .populate({
        path: 'counselorId',
        model: 'User',
        select: 'fullName email'
      });
    
    console.log('📅 All confirmed sessions today (email not sent):', allSessionsToday.length);
    console.log('📅 Session times today:', allSessionsToday.map(s => ({ 
      id: s._id, 
      date: s.date,
      time: s.time, 
      emailSent: s.emailSent,
      patientName: s.patientId?.fullName || 'Unknown Patient',
      counselorName: s.counselorId?.fullName || 'Unknown Counselor'
    })));

    // Filter sessions that are within the next 30 minutes
    const sessionsToNotify = allSessionsToday.filter(session => {
      const sessionDateTime = dayjs(`${session.date} ${session.time}`, 'YYYY-MM-DD HH:mm').tz(sriLankaTimezone);
      const isWithinNext30Minutes = sessionDateTime.isAfter(now) && sessionDateTime.isBefore(thirtyMinutesLater);
      
      console.log(`🕐 Session ${session._id} at ${session.time}:`, {
        sessionTime: sessionDateTime.format(),
        patientName: session.patientId?.fullName || 'Unknown',
        counselorName: session.counselorId?.fullName || 'Unknown',
        isAfterNow: sessionDateTime.isAfter(now),
        isBeforeThirtyMin: sessionDateTime.isBefore(thirtyMinutesLater),
        isWithinNext30Minutes
      });
      
      return isWithinNext30Minutes;
    });

    console.log('🎯 Sessions to notify (within next 30 min):', sessionsToNotify.length);

    if (!sessionsToNotify.length) {
      return NextResponse.json({ 
        message: 'No sessions to notify within the next 30 minutes.',
        debug: {
          currentTime: now.format(),
          thirtyMinutesLater: thirtyMinutesLater.format(),
          searchDate: formattedDate,
          timezone: sriLankaTimezone,
          allSessionsToday: allSessionsToday.length,
          sessionTimesToday: allSessionsToday.map(s => ({ 
            time: s.time, 
            emailSent: s.emailSent,
            patientName: s.patientId?.fullName || 'Unknown',
            counselorName: s.counselorId?.fullName || 'Unknown'
          }))
        }
      });
    }

    // Fixed: Use createTransport instead of createTransporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let emailsSent = 0;
    let emailsSkipped = 0;

    for (const session of sessionsToNotify) {
      const { patientId, counselorId, zoomLink } = session;

      // Double-check emailSent status to prevent duplicates
      if (session.emailSent === 'yes') {
        console.log(`⏭️ Skipping session ${session._id} - email already sent`);
        emailsSkipped++;
        continue;
      }

      // Check if we have valid patient and counselor data
      if (!patientId || !counselorId || !patientId.email || !counselorId.email || !zoomLink) {
        console.log(`⚠️ Skipping session ${session._id} - missing data:`, {
          hasPatient: !!patientId,
          hasCounselor: !!counselorId,
          hasPatientEmail: !!patientId?.email,
          hasCounselorEmail: !!counselorId?.email,
          hasZoomLink: !!zoomLink,
          patientName: patientId?.fullName || 'Unknown',
          counselorName: counselorId?.fullName || 'Unknown'
        });
        emailsSkipped++;
        continue;
      }

      const sessionDateTime = dayjs(`${session.date} ${session.time}`, 'YYYY-MM-DD HH:mm').tz(sriLankaTimezone);
      const minutesUntilSession = sessionDateTime.diff(now, 'minute');

      const htmlContent = `
        <div style="background-color:#f4f4f7;padding:30px 0;font-family:'Segoe UI',Roboto,sans-serif;">
          <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:10px;box-shadow:0 4px 10px rgba(0,0,0,0.1);overflow:hidden;">
            <div style="padding:30px;text-align:center;">
              <h2 style="color:#333333;">🕒 Your Session Starts in ${minutesUntilSession} Minutes</h2>
              <p style="color:#555;font-size:16px;">Here are the details of your upcoming session:</p>
              <table style="width:100%;margin:20px 0;">
                <tr>
                  <td style="padding:10px;text-align:right;font-weight:bold;color:#333;">Date:</td>
                  <td style="padding:10px;text-align:left;color:#555;">${session.date}</td>
                </tr>
                <tr>
                  <td style="padding:10px;text-align:right;font-weight:bold;color:#333;">Time:</td>
                  <td style="padding:10px;text-align:left;color:#555;">${session.time} (Sri Lanka Time)</td>
                </tr>
                <tr>
                  <td style="padding:10px;text-align:right;font-weight:bold;color:#333;">Patient:</td>
                  <td style="padding:10px;text-align:left;color:#555;">${patientId.fullName}</td>
                </tr>
                <tr>
                  <td style="padding:10px;text-align:right;font-weight:bold;color:#333;">Counselor:</td>
                  <td style="padding:10px;text-align:left;color:#555;">${counselorId.fullName}</td>
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
        subject: `Reminder: Your Session Starts in ${minutesUntilSession} Minutes`,
        html: htmlContent,
      };

      try {
        // FIRST: Mark as email sent BEFORE sending to prevent duplicates
        console.log(`📧 Attempting to update session ${session._id} emailSent status...`);
        
        const updateResult = await Session.findByIdAndUpdate(
          session._id, 
          { 
            $set: {
              emailSent: 'yes',
              emailSentAt: new Date()
            }
          },
          { 
            new: true,
            runValidators: true 
          }
        );

        if (!updateResult) {
          console.error(`❌ Failed to update session ${session._id} - session not found`);
          emailsSkipped++;
          continue;
        }

        console.log(`📧 Successfully marked session ${session._id} as email sent:`, {
          emailSent: updateResult.emailSent,
          emailSentAt: updateResult.emailSentAt
        });

        // THEN: Send the email
        await transporter.sendMail(mailOptions);
        emailsSent++;
        console.log(`✅ Email sent successfully for session ${session._id} to ${patientId.email} and ${counselorId.email} - ${minutesUntilSession} minutes until session`);
        
      } catch (error) {
        console.error(`❌ Failed to process session ${session._id}:`, error);
        
        // If there was an error after marking as sent, optionally revert
        try {
          await Session.findByIdAndUpdate(session._id, { 
            $set: { emailSent: 'no' },
            $unset: { emailSentAt: 1 }
          });
          console.log(`🔄 Reverted emailSent status for session ${session._id} due to error`);
        } catch (revertError) {
          console.error(`❌ Failed to revert emailSent status for session ${session._id}:`, revertError);
        }
        
        emailsSkipped++;
      }
    }

    return NextResponse.json({ 
      message: `Checked sessions and sent reminders where needed.`,
      summary: {
        totalSessionsToNotify: sessionsToNotify.length,
        emailsSent,
        emailsSkipped,
        timezone: sriLankaTimezone,
        currentTime: now.format(),
        searchCriteria: {
          date: formattedDate,
          timeRange: `${now.format('HH:mm')} - ${thirtyMinutesLater.format('HH:mm')}`
        }
      }
    });
  } catch (err) {
    console.error('❌ Cron job failed:', err);
    return NextResponse.json({ 
      error: 'Server error',
      details: err.message 
    }, { status: 500 });
  }
}