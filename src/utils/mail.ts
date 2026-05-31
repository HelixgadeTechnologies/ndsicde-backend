import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER, FRONT_END_URL, SMTP_HOST, SMTP_PORT } from "../secrets";
import { prisma } from "../lib/prisma";

const createTransporter = () =>
  nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: true,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    tls: { rejectUnauthorized: false },
  });

export const sendWelcomeEmail = async (email: string, fullName: string) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Welcome to NDSICDE!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <title>Welcome to NDSICDE</title>
        </head>
        <body style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; color: #1e293b;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
            <!-- Header Accent Bar -->
            <div style="background-color: #c10015; height: 6px;"></div>
            
            <div style="padding: 40px 30px;">
              <!-- Logo / Brand Header -->
              <div style="margin-bottom: 30px; text-align: center;">
                <span style="font-size: 24px; font-weight: 800; letter-spacing: 0.5px; color: #c10015;">NDSICDE</span>
              </div>

              <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px; text-align: center;">Welcome to the Platform!</h2>
              
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hello <strong>${fullName}</strong>,</p>
              
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Your account has been successfully created. You can now access your dashboard using the credentials provided below:
              </p>

              <!-- Credentials Box -->
              <div style="background-color: #f0f4f9; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #c10015;">
                <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600; color: #475569; width: 90px;">Email:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-family: monospace; font-size: 16px;"><strong>${email}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: 600; color: #475569;">Password:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-family: monospace; font-size: 16px;"><strong>12345</strong></td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${FRONT_END_URL}" target="_blank" style="background-color: #c10015; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block; font-weight: 700; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(193, 0, 21, 0.2);">
                  Log into Account
                </a>
              </div>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; font-size: 14px; line-height: 1.5; color: #64748b;">
                <p style="margin: 0 0 8px 0; font-weight: 600; color: #c10015;">⚠️ Security Reminder:</p>
                <p style="margin: 0;">For security purposes, please navigate to your settings and change your password immediately after logging in.</p>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
              <p style="margin: 0 0 4px 0;">This is an automated message, please do not reply directly to this email.</p>
              <p style="margin: 0; font-weight: 600; color: #64748b;">Powered by NDSICDE.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export async function getNextApproverEmails(
  userId: string,
  actionName: "Request" | "Retirement",
  requestId?: string,
  retirementId?: string
): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { userId },
    include: { role: true },
  });

  const level = user?.role?.level;
  if (!level) return [];

  const getUniversalEmails = async (roleLevel: number): Promise<string[]> => {
    const users = await prisma.user.findMany({
      where: { role: { level: roleLevel } },
      select: { email: true },
    });
    return users.map((u) => u.email).filter((e): e is string => !!e);
  };

  const getUserEmail = async (targetUserId: string | null | undefined): Promise<string[]> => {
    if (!targetUserId) return [];
    const u = await prisma.user.findUnique({
      where: { userId: targetUserId },
      select: { email: true },
    });
    return u?.email ? [u.email] : [];
  };

  if (actionName === "Request") {
    if (!requestId) return [];

    if (level === 1) {
      const req = await prisma.request.findUnique({
        where: { requestId },
        select: { isJourneyManagementRequired: true, sendTo2: true },
      });
      if (!req) return [];
      return req.isJourneyManagementRequired
        ? getUniversalEmails(2)
        : getUserEmail(req.sendTo2);
    }

    if (level === 2) {
      const req = await prisma.request.findUnique({
        where: { requestId },
        select: { sendTo2: true },
      });
      return getUserEmail(req?.sendTo2);
    }

    if (level === 3) return getUniversalEmails(4);
    if (level === 4) return getUniversalEmails(5);
    if (level === 5) return [];
  }

  if (actionName === "Retirement") {
    if (!retirementId) return [];

    if (level === 3) return getUniversalEmails(4);
    if (level === 4) return getUniversalEmails(5);

    if (level === 5) {
      const ret = await prisma.retirement.findUnique({
        where: { retirementId },
        select: { sendTo: true } as any,
      });
      return getUserEmail((ret as any)?.sendTo);
    }
  }

  return [];
}

const baseHtml = (content: string) => `
  <!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
  <body style="font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f8fafc;margin:0;padding:40px 20px;color:#1e293b;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);border:1px solid #e2e8f0;">
      <div style="background-color:#c10015;height:6px;"></div>
      <div style="padding:40px 30px;">
        <div style="margin-bottom:24px;text-align:center;">
          <span style="font-size:24px;font-weight:800;color:#c10015;">NDSICDE</span>
        </div>
        ${content}
      </div>
      <div style="background-color:#f8fafc;padding:20px 30px;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#94a3b8;">
        <p style="margin:0;">This is an automated message, please do not reply directly to this email.</p>
      </div>
    </div>
  </body></html>
`;

export const sendPendingApprovalEmail = async (emails: string[], title: string) => {
  if (!emails.length) return;
  try {
    await createTransporter().sendMail({
      from: EMAIL_USER,
      to: emails.join(","),
      subject: `Action Required: Approval Pending — ${title}`,
      html: baseHtml(`
        <h2 style="color:#0f172a;font-size:20px;font-weight:700;text-align:center;margin:0 0 20px;">Approval Required</h2>
        <p style="font-size:16px;line-height:1.6;">You have a pending approval request waiting for your review:</p>
        <div style="background:#f0f4f9;border-radius:8px;padding:16px 20px;margin:20px 0;border-left:4px solid #c10015;">
          <p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">${title}</p>
        </div>
        <div style="text-align:center;margin-top:28px;">
          <a href="${FRONT_END_URL}" target="_blank" style="background-color:#c10015;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;display:inline-block;font-weight:700;font-size:15px;">
            Review &amp; Approve
          </a>
        </div>
      `),
    });
  } catch (error) {
    console.error("Error sending pending approval email:", error);
  }
};

export const sendApprovalCompleteEmail = async (email: string, title: string) => {
  try {
    await createTransporter().sendMail({
      from: EMAIL_USER,
      to: email,
      subject: `Approved: ${title}`,
      html: baseHtml(`
        <h2 style="color:#0f172a;font-size:20px;font-weight:700;text-align:center;margin:0 0 20px;">Request Fully Approved ✓</h2>
        <p style="font-size:16px;line-height:1.6;">Your request has been approved at all levels and is now complete:</p>
        <div style="background:#f0f4f9;border-radius:8px;padding:16px 20px;margin:20px 0;border-left:4px solid #16a34a;">
          <p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">${title}</p>
        </div>
        <div style="text-align:center;margin-top:28px;">
          <a href="${FRONT_END_URL}" target="_blank" style="background-color:#c10015;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;display:inline-block;font-weight:700;font-size:15px;">
            View Request
          </a>
        </div>
      `),
    });
  } catch (error) {
    console.error("Error sending approval complete email:", error);
  }
};
export const sendApprovalCompleteRetirementEmail = async (email: string, title: string) => {
  try {
    await createTransporter().sendMail({
      from: EMAIL_USER,
      to: email,
      subject: `Approved: ${title}`,
      html: baseHtml(`
        <h2 style="color:#0f172a;font-size:20px;font-weight:700;text-align:center;margin:0 0 20px;">Retirement Fully Approved ✓</h2>
        <p style="font-size:16px;line-height:1.6;">The retirement has been approved at all levels, please input the journal ID to close out the transaction:</p>
        <div style="background:#f0f4f9;border-radius:8px;padding:16px 20px;margin:20px 0;border-left:4px solid #16a34a;">
          <p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">${title}</p>
        </div>
        <div style="text-align:center;margin-top:28px;">
          <a href="${FRONT_END_URL}" target="_blank" style="background-color:#c10015;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;display:inline-block;font-weight:700;font-size:15px;">
            View Request
          </a>
        </div>
      `),
    });
  } catch (error) {
    console.error("Error sending approval complete email:", error);
  }
};

export const sendRejectionEmail = async (email: string, title: string, comment?: string) => {
  try {
    await createTransporter().sendMail({
      from: EMAIL_USER,
      to: email,
      subject: `Rejected: ${title}`,
      html: baseHtml(`
        <h2 style="color:#0f172a;font-size:20px;font-weight:700;text-align:center;margin:0 0 20px;">Request Rejected</h2>
        <p style="font-size:16px;line-height:1.6;">Your request has been rejected:</p>
        <div style="background:#f0f4f9;border-radius:8px;padding:16px 20px;margin:20px 0;border-left:4px solid #c10015;">
          <p style="margin:0 0 8px;font-size:15px;font-weight:600;color:#0f172a;">${title}</p>
          ${comment ? `<p style="margin:0;font-size:14px;color:#475569;"><strong>Reason:</strong> ${comment}</p>` : ""}
        </div>
        <div style="text-align:center;margin-top:28px;">
          <a href="${FRONT_END_URL}" target="_blank" style="background-color:#c10015;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;display:inline-block;font-weight:700;font-size:15px;">
            View Request
          </a>
        </div>
      `),
    });
  } catch (error) {
    console.error("Error sending rejection email:", error);
  }
};

export const sendJournalEntryEmail = async (emails: string[], title: string) => {
  if (!emails.length) return;
  try {
    await createTransporter().sendMail({
      from: EMAIL_USER,
      to: emails.join(","),
      subject: `Action Required: Enter Journal ID — ${title}`,
      html: baseHtml(`
        <h2 style="color:#0f172a;font-size:20px;font-weight:700;text-align:center;margin:0 0 20px;">Retirement Fully Approved</h2>
        <p style="font-size:16px;line-height:1.6;">The following retirement has been approved at all levels. Please log in and enter the journal ID to complete the process:</p>
        <div style="background:#f0f4f9;border-radius:8px;padding:16px 20px;margin:20px 0;border-left:4px solid #16a34a;">
          <p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">${title}</p>
        </div>
        <div style="text-align:center;margin-top:28px;">
          <a href="${FRONT_END_URL}" target="_blank" style="background-color:#c10015;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;display:inline-block;font-weight:700;font-size:15px;">
            Enter Journal ID
          </a>
        </div>
      `),
    });
  } catch (error) {
    console.error("Error sending journal entry email:", error);
  }
};

export const sendReviewRequestEmail = async (email: string, title: string, comment?: string) => {
  try {
    await createTransporter().sendMail({
      from: EMAIL_USER,
      to: email,
      subject: `Review Required: ${title}`,
      html: baseHtml(`
        <h2 style="color:#0f172a;font-size:20px;font-weight:700;text-align:center;margin:0 0 20px;">Request Sent Back for Review</h2>
        <p style="font-size:16px;line-height:1.6;">Your request has been sent back and requires your attention:</p>
        <div style="background:#f0f4f9;border-radius:8px;padding:16px 20px;margin:20px 0;border-left:4px solid #f59e0b;">
          <p style="margin:0 0 8px;font-size:15px;font-weight:600;color:#0f172a;">${title}</p>
          ${comment ? `<p style="margin:0;font-size:14px;color:#475569;"><strong>Notes:</strong> ${comment}</p>` : ""}
        </div>
        <div style="text-align:center;margin-top:28px;">
          <a href="${FRONT_END_URL}" target="_blank" style="background-color:#c10015;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;display:inline-block;font-weight:700;font-size:15px;">
            Update Request
          </a>
        </div>
      `),
    });
  } catch (error) {
    console.error("Error sending review request email:", error);
  }
};
