const nodemailer = require("nodemailer");
const env = require("../config/env");

class EmailService {
  constructor() {
    this.transporter = null;
    if (env.smtpHost && env.smtpUser && env.smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpPort === 465, // true for 465, false for other ports
        auth: {
          user: env.smtpUser,
          pass: env.smtpPass
        }
      });
    } else {
      console.warn("[EmailService] SMTP credentials not fully configured. Emails will be logged to console instead of sent.");
    }
  }

  async sendOtpEmail(to, otp) {
    const mailOptions = {
      from: env.smtpFrom || '"Gyanodaya Support" <noreply@gyanodaya.net>',
      to,
      subject: "Gyanodaya Password Reset OTP",
      text: `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4A90E2; text-align: center;">Gyanodaya Password Reset</h2>
          <p>Hello,</p>
          <p>We received a request to reset the password for your Gyanodaya account. Use the verification code below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px 20px; background-color: #f5f5f5; border: 1px dashed #cccccc; border-radius: 4px; color: #333333;">${otp}</span>
          </div>
          <p style="color: #666666; font-size: 14px;">This code is valid for <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999999; text-align: center;">Gyanodaya EdTech Platform</p>
        </div>
      `
    };

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`[EmailService] OTP Email sent successfully to ${to}. MessageId: ${info.messageId}`);
        return true;
      } catch (error) {
        console.error(`[EmailService] Failed to send email to ${to}:`, error);
        return false;
      }
    } else {
      console.log(`[EmailService Mock] Dispatching email to ${to} with OTP: ${otp}`);
      return true;
    }
  }
}

module.exports = new EmailService();
