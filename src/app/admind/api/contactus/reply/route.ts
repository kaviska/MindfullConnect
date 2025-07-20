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
        const { to, subject, message, originalMessage } = await request.json();

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
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    .header {
                        background-color: #1045A1;
                        padding: 20px;
                        text-align: center;
                    }
                    .header h1 {
                        color: white;
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                        background-color: #f9f9f9;
                    }
                    .reply-message {
                        background-color: white;
                        padding: 20px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                    }
                    .original-message {
                        background-color: #f0f0f0;
                        padding: 20px;
                        border-radius: 5px;
                        margin-top: 20px;
                        font-style: italic;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        font-size: 12px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>MindfulConnect Response</h1>
                </div>
                <div class="content">
                    <div class="reply-message">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                    
                    <div class="original-message">
                        <strong>Your Original Message:</strong><br><br>
                        ${originalMessage.replace(/\n/g, '<br>')}
                    </div>
                </div>
                <div class="footer">
                    <p>This is an automated response from MindfulConnect. Please do not reply directly to this email.</p>
                    <p>© ${new Date().getFullYear()} MindfulConnect. All rights reserved.</p>
                </div>
            </body>
            </html>
        `;

        // Create plain text version as fallback
        const textContent = `
            MindfulConnect Response
            
            ${message}
            
            Your Original Message:
            ${originalMessage}
            
            ---
            This is an automated response from MindfulConnect. Please do not reply directly to this email.
            © ${new Date().getFullYear()} MindfulConnect. All rights reserved.
        `;

        // Connect to database
        await dbConnect();

        // Send email
        await transporter.sendMail({
            from: {
                name: "MindfulConnect Support",
                address: process.env.EMAIL_USER as string
            },
            to,
            subject,
            text: textContent,
            html: htmlContent,
        });

        // Update the contact message status
        const messageId = request.headers.get('x-message-id');
        if (!messageId) {
            throw new Error('Message ID not provided');
        }

        await ContactUs.findByIdAndUpdate(messageId, {
            replied: true,
            replyDate: new Date()
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json(
            { success: false, error: "Failed to send email" },
            { status: 500 }
        );
    }
}
