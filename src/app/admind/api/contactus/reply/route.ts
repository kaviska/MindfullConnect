import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/app/lib/mongodb";
import ContactUs from "@/app/models/contactus";

// Configure email transporter
const transporter = nodemailer.createTransport({
    // Replace these with your email service configuration
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function POST(request: Request) {
    try {
        const { to, subject, message, originalMessage, messageId } = await request.json();

        // Connect to database
        await dbConnect();

        if (!to || !message) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Create HTML email template
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { 
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background-color: #1045A1;
                        color: white;
                        padding: 20px;
                        text-align: center;
                    }
                    .content {
                        background-color: #ffffff;
                        padding: 20px;
                    }
                    .reply-message {
                        margin-bottom: 30px;
                        padding: 20px;
                        background-color: #f8f9fa;
                        border-radius: 5px;
                    }
                    .original-message {
                        margin-top: 30px;
                        padding: 20px;
                        background-color: #f1f1f1;
                        border-left: 4px solid #1045A1;
                        border-radius: 5px;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                        text-align: center;
                        color: #666;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Response from MindfulConnect</h2>
                    </div>
                    <div class="content">
                        <div class="reply-message">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                        
                        <div class="original-message">
                            <strong>Your Original Message:</strong><br><br>
                            ${originalMessage.replace(/\n/g, '<br>')}
                        </div>
                        
                        <div class="footer">
                            <p>Thank you for contacting MindfulConnect.<br>
                            This is an automated email, please do not reply directly to this message.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Create plain text version as fallback
        const textContent = `
Response from MindfulConnect:

${message}

---------------
Original Message:
---------------
${originalMessage}

Thank you for contacting MindfulConnect.
This is an automated email, please do not reply directly to this message.
        `;

        // Send email
        // Send email
        await transporter.sendMail({
            from: `"MindfulConnect Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text: textContent, // Fallback plain text version
            html: htmlContent, // HTML version
        });

        // Delete the message from the database
        const deletedMessage = await ContactUs.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            throw new Error('Message not found in database');
        }

        return NextResponse.json({ success: true, message: 'Reply sent and message deleted' });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json(
            { success: false, error: "Failed to send email" },
            { status: 500 }
        );
    }
}
