import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import User from '@/models/user.model';

const createTransport = () => {
  return nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendLoginNotification = async ({ 
  email, 
  name, 
  loginTime, 
  deviceInfo 
}: { 
  email: string; 
  name: string; 
  loginTime: string;
  deviceInfo: {
    browser: string;
    os: string;
    location: string;
  };
}) => {
  try {
    const transport = createTransport();
    const date = new Date(loginTime);
    const formattedDate = date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    const loginTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Login to Your Account</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f5;
          }
          
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .header {
            background-color: #2563eb;
            padding: 32px;
            text-align: center;
          }
          
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            margin: 0;
          }
          
          .content {
            padding: 32px;
            color: #1f2937;
          }
          
          h1 {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 24px;
            color: #1f2937;
          }
          
          p {
            font-size: 16px;
            line-height: 1.5;
            margin: 0 0 24px;
            color: #4b5563;
          }

          .info-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
          }

          .info-item {
            display: flex;
            margin-bottom: 12px;
          }

          .info-label {
            font-weight: 500;
            color: #64748b;
            width: 120px;
          }

          .info-value {
            color: #1f2937;
          }
          
          .alert {
            background-color: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 6px;
            padding: 16px;
            margin: 24px 0;
            color: #991b1b;
          }
          
          .footer {
            background-color: #f9fafb;
            padding: 24px 32px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
          }
          
          @media only screen and (max-width: 600px) {
            .container {
              margin: 0;
              border-radius: 0;
            }
            
            .header, .content, .footer {
              padding: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">QR Service</h1>
          </div>
          
          <div class="content">
            <h1>New Login to Your Account</h1>
            <p>Hi ${name},</p>
            <p>We detected a new login to your QR Service account. Here are the details:</p>
            
            <div class="info-box">
              <div class="info-item">
                <span class="info-label">Time:</span>
                <span class="info-value">${formattedDate}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Browser:</span>
                <span class="info-value">${deviceInfo.browser}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Device:</span>
                <span class="info-value">${deviceInfo.os}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Location:</span>
                <span class="info-value">${deviceInfo.location}</span>
              </div>
            </div>

            <div class="alert">
              If you don't recognize this activity, please change your password immediately and contact our support team.
            </div>
            
            <p>For your security, we recommend:</p>
            <ul>
              <li>Using a strong, unique password</li>
              <li>Enabling two-factor authentication</li>
              <li>Regularly reviewing your account activity</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} QR Service. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `QR Service <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'New Login to Your QR Service Account',
      html: loginTemplate,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    console.log('Login notification sent:', mailresponse.messageId);
    return true;
  } catch (error: any) {
    console.error('Error sending login notification:', error);
    return false;
  }
};

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // Create a hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === 'RESET') {
      await User.findByIdAndUpdate(userId, {
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: Date.now() + 3600000,
      });
    }

    const transport = createTransport();

    const resetPasswordTemplate = (resetLink: string) => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f5;
          }
          
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .header {
            background-color: #2563eb;
            padding: 32px;
            text-align: center;
          }
          
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            margin: 0;
          }
          
          .content {
            padding: 32px;
            color: #1f2937;
          }
          
          h1 {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 24px;
            color: #1f2937;
          }
          
          p {
            font-size: 16px;
            line-height: 1.5;
            margin: 0 0 24px;
            color: #4b5563;
          }
          
          .button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            margin: 8px 0;
          }
          
          .button:hover {
            background-color: #1d4ed8;
          }
          
          .notice {
            font-size: 14px;
            color: #6b7280;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
          }
          
          .footer {
            background-color: #f9fafb;
            padding: 24px 32px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
          }
          
          @media only screen and (max-width: 600px) {
            .container {
              margin: 0;
              border-radius: 0;
            }
            
            .header, .content, .footer {
              padding: 24px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">QR Service</h1>
          </div>
          
          <div class="content">
            <h1>Reset Your Password</h1>
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the button below to create a new password. This link is valid for 1 hour.</p>
            
            <a href="${resetLink}" class="button">Reset Password</a>
            
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            
            <div class="notice">
              <p>For security reasons, this link will expire in 1 hour. If you need to reset your password after that, please request a new reset link.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent by QR Service. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} QR Service. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create verify and reset links
    const domain = process.env.DOMAIN || 'http://localhost:3000';
    const resetLink = `${domain}/auth/reset-password?token=${hashedToken}`;

    const mailOptions = {
      from: `QR Service <${process.env.SMTP_USER}>`,
      to: email,
      subject: emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
      html: resetPasswordTemplate(resetLink),
    };

    const mailresponse = await transport.sendMail(mailOptions);
    console.log('Email sent successfully:', mailresponse.messageId);
    return mailresponse;
  } catch (error: any) {
    console.error('Error sending email:', error);
    return false;
  }
};
