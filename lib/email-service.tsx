import nodemailer from "nodemailer"

interface SendBadgeEmailParams {
  to: string
  attendeeName: string
  eventTitle: string
  badgeDataUrl: string
}

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
}

export async function sendBadgeEmail({ to, attendeeName, eventTitle, badgeDataUrl }: SendBadgeEmailParams) {
  console.log("[v0] Preparing to send badge email to:", to)

  const base64Data = badgeDataUrl.replace(/^data:image\/\w+;base64,/, "")
  const buffer = Buffer.from(base64Data, "base64")

  const transporter = createTransporter()

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `Your Visitor Badge for ${eventTitle}`,
    html: `
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
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .badge-preview {
              text-align: center;
              margin: 20px 0;
            }
            .badge-preview img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Your Visitor Badge is Ready!</h1>
          </div>
          <div class="content">
            <p>Dear ${attendeeName},</p>
            
            <p>Your visitor badge for <strong>${eventTitle}</strong> has been generated and is attached to this email.</p>
            
            <div class="badge-preview">
              <img src="cid:badge" alt="Visitor Badge" />
            </div>
            
            <p><strong>Important Instructions:</strong></p>
            <ul>
              <li>Download and save the attached badge image</li>
              <li>Print the badge or display it on your mobile device</li>
              <li>Present your badge at the event entrance for quick check-in</li>
              <li>The QR code on your badge contains your registration details</li>
            </ul>
            
            <p>We look forward to seeing you at the event!</p>
            
            <p>Best regards,<br>Event Management Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </body>
      </html>
    `,
    attachments: [
      {
        filename: `visitor-badge-${attendeeName.replace(/\s+/g, "-").toLowerCase()}.png`,
        content: buffer,
        cid: "badge", // Content ID for embedding in HTML
      },
    ],
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("[v0] Email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
