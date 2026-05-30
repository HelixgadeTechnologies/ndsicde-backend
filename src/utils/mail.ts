import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER, FRONT_END_URL, SMTP_HOST, SMTP_PORT } from "../secrets";
export const sendAdminRegistrationEmail = async (email: string, adminName: string, type: string) => {
  try {

    // Configure the transporter (Use real SMTP credentials)
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: true, // Use `true` for port 465, `false` for 587
      auth: {
        user: EMAIL_USER, // Your Gmail email
        pass: EMAIL_PASS, // Your Gmail App Password
      },
      tls: {
        rejectUnauthorized: false, // Bypass certificate issues (if any)
      },
    });

    // Email options
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: `${type} Account Registration`,
      // text: `
      //     Hello ${adminName},

      //     Your ${type.trim().toLowerCase()} account has been successfully registered.
      //     You can now log in with the following credentials, navigate to setting and change your password:

      //     Email: ${email}
      //     Password: 12345

      //     Best regards,
      //     HCDT Team

      //     **Please do not reply to this email. This is an automated message.**`
      // ,
      html: `
            <p>Hello ${adminName},</p>
    
            <p>Your <strong>${type.trim().toLowerCase()}</strong> account has been successfully registered.</p>
    
            <p>You can now log in using the credentials provided below:</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> 12345</p>
    
            <p>Click the link below to log in:</p>
            <p><a href="https://app-hcdtmonitor.netlify.app/" target="_blank">Go to Login Page</a></p>
    
            <p>Best regards,<br>I-HCDT Monitor Team</p>
    
            <p style="color: gray; font-size: 12px;"><em>Please do not reply to this email. This is an automated message.</em></p>
        `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully to", email);
  } catch (error) {
    // console.error("Error sending email:", error);
  }
};
// export const sendConflictReportEmail = async (email: string, type: string) => {
//     try {

//         // Configure the transporter (Use real SMTP credentials)
//         const transporter = nodemailer.createTransport({
//             host: SMTP_HOST,
//             port: Number(SMTP_PORT),
//             secure: true, // Use `true` for port 465, `false` for 587
//             auth: {
//                 user: EMAIL_USER, // Your Gmail email
//                 pass: EMAIL_PASS, // Your Gmail App Password
//             },
//             tls: {
//                 rejectUnauthorized: false, // Bypass certificate issues (if any)
//             },
//         });

//         // Email options
//         const mailOptions = {
//             from: EMAIL_USER,
//             to: email,
//             subject: `${type} Survey Report`,
//             // text: `
//             //     Hello ${adminName},

//             //     Your ${type.trim().toLowerCase()} account has been successfully registered.
//             //     You can now log in with the following credentials, navigate to setting and change your password:

//             //     Email: ${email}
//             //     Password: 12345

//             //     Best regards,
//             //     HCDT Team

//             //     **Please do not reply to this email. This is an automated message.**`
//             // ,
//             html: `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <meta charset="UTF-8" />
//                 <title>${type} Survey Notification</title>
//             </head>
//             <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
//                 <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//                 <h2 style="color: #1a73e8;">${type} Survey Submitted</h2>
//                 <p>Dear Recipient,</p>
//                 <p>
//                     This is to notify you that a new <strong>${type.trim().toLowerCase()}</strong> survey titled  has been submitted successfully.
//                 </p>
//                 <p style="color: #888888; font-size: 14px;">
//                     Please note that this is an automated message. Do not reply to this email.
//                 </p>
//                 <p>Thank you,<br /><strong>HCDT</strong></p>
//                 </div>
//             </body>
//             </html>
//         `,
//         };

//         // Send the email
//         await transporter.sendMail(mailOptions);
//         // console.log("Email sent successfully to", email);
//     } catch (error) {
//         // console.error("Error sending email:", error);
//     }
// };



export const sendConflictReportEmail = async (emails: string[], type: string, details?: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: emails.join(','), // Join multiple emails
      subject: `HCDT ${type} Report`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>${type} Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1a73e8;">New HCDT Related ${type} Report</h2>
            <p>Dear Recipient,</p>
            <p>
                A new <strong>${type.trim().toLowerCase()}</strong> has been submitted with the following details:
            </p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Trust:</strong> ${details?.trustName || 'N/A'}</p>
                <p><strong>Cause of Conflict:</strong> ${details?.causeOfConflict || 'N/A'}</p>
                <p><strong>Conflict Status:</strong> ${details?.statusOfConflict || 'N/A'}</p>
                <p><strong>Parties Involved:</strong> ${details?.partiesInvolved || 'N/A'}</p>
                <p><strong>Issue Addressed By:</strong> ${details?.issueAddressedBy || 'N/A'}</p>
                <p><strong>Court Litigation Status:</strong> ${details?.statusOfCourtLitigation || 'N/A'}</p>
                <p><strong>Issue Narrative:</strong></p>
                <p style="white-space: pre-wrap;">${details?.narrateIssues || 'N/A'}</p>
            </div>
            <p style="color: #888888; font-size: 14px;">
                Please note that this is an automated message. Do not reply to this email.
            </p>
            <p>Thank you,<br /><strong>I-HCDT Monitor Team</strong></p>
            </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendGeneralSurveyReportEmail = async (emails: string[], type: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: emails.join(','),
      subject: `New ${type} Submission`,
      html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8" />
                <title>${type} Notification</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #1a73e8;">${type} Submitted</h2>
                <p>Dear Recipient,</p>
                <p>
                    This is to notify you that a new <strong>${type.toLowerCase()}</strong> survey has been submitted successfully.
                </p>
                <p style="color: #888888; font-size: 14px;">
                    Please note that this is an automated message. Do not reply to this email.
                </p>
                <p>Thank you,<br /><strong>I-HCDT Monitor Team</strong></p>
                </div>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
export const sendReportLinkEmail = async (emails: string[], type: string, link: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: emails.join(','), // Join multiple emails
      subject: `${type} Survey Invitation`,
      html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <title>${type} Survey Invitation</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
              <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <h2 style="color: #1a73e8; text-align: center;">${type} Survey Invitation</h2>
                
                <p>Dear Recipient,</p>

                <p>
                  You have been invited to complete a brief <strong>${type} Survey</strong> to help us better understand issues and improve our engagement with host communities.
                </p>

                <p>
                  Please click the link below to access the private survey form:
                </p>

                <p style="text-align: center; margin: 30px 0;">
                  <a href="${link}" style="background-color: #1a73e8; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Take the Survey
                  </a>
                </p>

                <p>
                  Kindly complete the survey as soon as possible. Your responses will remain confidential and will be used solely for research and development purposes.
                </p>

                <p style="color: #888888; font-size: 13px;">
                  This is an automated message. Please do not reply to this email.
                </p>

                <p>Thank you,<br /><strong>I-HCDT Monitor Team</strong></p>
              </div>
            </body>
          </html>

      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendWelcomeEmail = async (email: string, fullName: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

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
