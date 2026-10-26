import { Resend } from 'resend';
import { env } from '../config/env.js';

/**
 * HTML entities escape helper preventing HTML injection in email bodies
 */
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const emailService = {
  isConfigured() {
    return Boolean(env.RESEND_API_KEY && env.RESEND_API_KEY.trim().length > 0);
  },

  /**
   * Dispatch admin notification when a new contact inquiry is received
   */
  async sendContactNotification(inquiry) {
    if (!this.isConfigured()) {
      return {
        sent: false,
        reason: 'UNCONFIGURED',
        note: 'RESEND_API_KEY is not configured in backend/.env. Email notification was skipped.',
      };
    }

    try {
      const resend = new Resend(env.RESEND_API_KEY);
      const recipient = env.CONTACT_RECEIVER_EMAIL || env.ADMIN_EMAIL;
      const safeName = escapeHtml(inquiry.name);
      const safeEmail = escapeHtml(inquiry.email);
      const safeSubject = escapeHtml(inquiry.subject || 'General Portfolio Inquiry');
      const safeMessage = escapeHtml(inquiry.message).replace(/\n/g, '<br/>');
      const formattedDate = new Date(inquiry.createdAt || Date.now()).toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      });
      const adminLink = `${env.APP_URL}/admin/messages`;

      const emailSubject = `New Portfolio Contact: ${inquiry.subject ? inquiry.subject : inquiry.name}`;

      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1120; color: #f8fafc; margin: 0; padding: 24px; }
    .card { max-width: 580px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 600; text-transform: uppercase; background-color: rgba(6,182,212,0.15); color: #22d3ee; border-radius: 6px; border: 1px solid rgba(6,182,212,0.3); }
    h2 { margin: 12px 0 4px 0; color: #ffffff; font-size: 20px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .meta-table td { padding: 6px 0; font-size: 13px; vertical-align: top; }
    .meta-label { color: #94a3b8; width: 90px; }
    .meta-value { color: #e2e8f0; font-weight: 500; }
    .message-box { background-color: #070d17; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px; white-space: pre-wrap; }
    .btn-row { display: flex; gap: 12px; }
    .btn { display: inline-block; padding: 10px 20px; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 8px; }
    .btn-primary { background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #020617; }
    .btn-secondary { background-color: #1e293b; color: #e2e8f0; border: 1px solid #334155; margin-left: 10px; }
    .footer { margin-top: 24px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #1e293b; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">New Inquiry</span>
      <h2>${safeSubject}</h2>
    </div>

    <table class="meta-table">
      <tr>
        <td class="meta-label">From:</td>
        <td class="meta-value">${safeName} &lt;<a href="mailto:${safeEmail}" style="color: #38bdf8;">${safeEmail}</a>&gt;</td>
      </tr>
      <tr>
        <td class="meta-label">Date:</td>
        <td class="meta-value">${formattedDate} (IST)</td>
      </tr>
      <tr>
        <td class="meta-label">Subject:</td>
        <td class="meta-value">${safeSubject}</td>
      </tr>
    </table>

    <div class="message-box">${safeMessage}</div>

    <div class="btn-row">
      <a href="mailto:${safeEmail}?subject=Re: ${encodeURIComponent(inquiry.subject || 'Portfolio Inquiry')}" class="btn btn-primary">Reply to ${safeName}</a>
      <a href="${adminLink}" class="btn btn-secondary">Open Admin Dashboard</a>
    </div>

    <div class="footer">
      Sent from Sumit Kumar's Developer Portfolio Contact System.
    </div>
  </div>
</body>
</html>
      `.trim();

      const text = `
New Portfolio Contact Inquiry
-----------------------------
From: ${inquiry.name} <${inquiry.email}>
Subject: ${inquiry.subject || 'General Portfolio Inquiry'}
Date: ${formattedDate} (IST)

Message:
${inquiry.message}

Reply to visitor: mailto:${inquiry.email}
Admin Dashboard: ${adminLink}
      `.trim();

      const { data, error } = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: [recipient],
        replyTo: inquiry.email,
        subject: emailSubject,
        html,
        text,
      });

      if (error) {
        console.error(`[EmailService] Resend dispatch error: ${error.message || JSON.stringify(error)}`);
        return { sent: false, error: error.message };
      }

      console.log(`[EmailService] Notification successfully dispatched via Resend. ID: ${data?.id}`);
      return { sent: true, id: data?.id };
    } catch (err) {
      console.error(`[EmailService] Unexpected failure: ${err.message}`);
      return { sent: false, error: err.message };
    }
  },

  /**
   * Dispatch reply email to visitor from Admin Dashboard
   */
  async sendReplyToVisitor({ to, visitorName, subject, replyText, originalMessage }) {
    if (!this.isConfigured()) {
      const err = new Error('Cannot send in-app reply: RESEND_API_KEY is not configured in backend/.env.');
      err.code = 'EMAIL_PROVIDER_UNCONFIGURED';
      err.statusCode = 503;
      throw err;
    }

    const resend = new Resend(env.RESEND_API_KEY);
    const safeName = escapeHtml(visitorName);
    const safeReply = escapeHtml(replyText).replace(/\n/g, '<br/>');
    const safeOriginal = escapeHtml(originalMessage).replace(/\n/g, '<br/>');

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b1120; color: #f8fafc; margin: 0; padding: 24px; }
    .card { max-width: 580px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 28px; }
    h2 { color: #ffffff; font-size: 20px; margin-top: 0; }
    .reply-body { font-size: 14px; line-height: 1.6; color: #f1f5f9; margin: 20px 0; }
    .quote-box { background-color: #070d17; border-left: 3px solid #06b6d4; padding: 12px 16px; border-radius: 4px; font-size: 12px; color: #94a3b8; margin-top: 24px; }
    .footer { margin-top: 24px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #1e293b; padding-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Hi ${safeName},</h2>
    <div class="reply-body">${safeReply}</div>

    <div class="quote-box">
      <strong>Your Original Message:</strong><br/>
      ${safeOriginal}
    </div>

    <div class="footer">
      Sumit Kumar • Full-Stack Developer • SAGE University, Indore
    </div>
  </div>
</body>
</html>
    `.trim();

    const text = `
Hi ${visitorName},

${replyText}

---
Your Original Message:
${originalMessage}

--
Sumit Kumar • Full-Stack Developer
    `.trim();

    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [to],
      replyTo: env.CONTACT_RECEIVER_EMAIL,
      subject: subject.startsWith('Re:') ? subject : `Re: ${subject}`,
      html,
      text,
    });

    if (error) {
      const err = new Error(error.message || 'Resend failed to send reply');
      err.code = 'EMAIL_SEND_FAILED';
      throw err;
    }

    return { success: true, id: data?.id };
  },
};

export default emailService;
