import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, message, type, budget, source, videoTitle, project } = body;
    
    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'Name and Phone are required fields.' }, { status: 400 });
    }

    // 1. Forward lead data to the Google Sheets Apps Script
    const sheetUrl = process.env.LEADS_GOOGLE_SHEET_URL || "https://script.google.com/macros/s/AKfycbzv0yRaBRDN4hcspVwk_-_mEz43xnU8fr7zhhI5MKfVOOJgePMFAga2C0EWje11nPKj/exec";
    let sheetSuccess = false;
    
    try {
      const sheetResponse = await fetch(sheetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: source || 'Website Contact Form',
          name,
          phone,
          email: email || '',
          message: message || '',
          project: project || videoTitle || '',
          type: type || '',
          budget: budget || '',
        }),
      });

      if (sheetResponse.ok) {
        sheetSuccess = true;
        console.log('Successfully logged lead to Google Sheet.');
      } else {
        console.error('Failed to log lead to Google Sheet. Status:', sheetResponse.status);
      }
    } catch (sheetErr) {
      console.error('Error forwarding lead to Google Sheets:', sheetErr);
    }

    // 1.5. Forward lead to the local CRM
    const crmUrl = process.env.CRM_API_URL || "http://localhost:3001/api/leads";
    let crmSuccess = false;
    try {
      const crmResponse = await fetch(crmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: source || 'Website Contact Form',
          name,
          phone,
          email: email || '',
          comment: message || '',
          propertyName: project || '',
          configuration: type || '',
          queryType: type || '',
        }),
      });

      if (crmResponse.ok) {
        crmSuccess = true;
        console.log('Successfully logged lead to local CRM.');
      } else {
        console.warn('Failed to log lead to local CRM. Status:', crmResponse.status);
      }
    } catch (crmErr: unknown) {
      const errorMessage = crmErr instanceof Error ? crmErr.message : String(crmErr);
      console.log('CRM integration skipped or offline:', errorMessage);
    }

    // 2. Dispatch email notification via SMTP (if configured)
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to = process.env.LEAD_RECEIVER_EMAIL || user;
    
    let emailSuccess = false;

    if (host && user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port: Number(port) || 465,
          secure: Number(port) === 465,
          auth: { user, pass },
        });

        // Format email body in rich HTML
        let htmlContent = `
          <div style="font-family: Arial, sans-serif; padding: 25px; color: #082126; max-width: 600px; border: 1px solid rgba(28, 108, 123, 0.2); border-radius: 12px; background-color: #FFFFFF;">
            <h2 style="color: #124C57; border-bottom: 2px solid #D5B37C; padding-bottom: 12px; margin-top: 0; font-family: Playfair Display, Georgia, serif;">
              New Website Enquiry Received
            </h2>
            <p style="font-size: 14px; line-height: 1.5; color: #4A5568;">
              You have a new prospect enquiry from the <strong>Property Saraansh</strong> website.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tbody>
                <tr>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-weight: bold; color: #124C57; width: 140px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Source</td>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-size: 14px;">${source || 'Website Contact'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-weight: bold; color: #124C57; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Name</td>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-size: 14px;"><strong>${name}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-weight: bold; color: #124C57; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Phone</td>
                  <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-size: 14px;"><a href="tel:${phone}">${phone}</a></td>
                </tr>
        `;

        if (email) {
          htmlContent += `
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-weight: bold; color: #124C57; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Email</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-size: 14px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
          `;
        }

        if (project) {
          htmlContent += `
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-weight: bold; color: #124C57; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Project</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-size: 14px; font-weight: bold;">${project}</td>
            </tr>
          `;
        } else if (videoTitle) {
          htmlContent += `
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-weight: bold; color: #124C57; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Video</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-size: 14px;">${videoTitle}</td>
            </tr>
          `;
        }

        if (type) {
          htmlContent += `
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-weight: bold; color: #124C57; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">BHK / Interest</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-size: 14px;">${type}</td>
            </tr>
          `;
        }

        if (budget) {
          htmlContent += `
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-weight: bold; color: #124C57; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Budget</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-size: 14px;">${budget}</td>
            </tr>
          `;
        }

        if (message) {
          htmlContent += `
            <tr>
              <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-weight: bold; color: #124C57; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Message</td>
              <td style="padding: 10px 8px; border-bottom: 1px solid #EAF4F6; font-size: 14px; white-space: pre-wrap;">${message}</td>
            </tr>
          `;
        }

        htmlContent += `
              </tbody>
            </table>
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #EAF4F6; font-size: 11px; color: #1C6C7B; text-align: center;">
              This notification was automatically sent by the Property Saraansh Website.
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `Property Saraansh Leads <${user}>`,
          to,
          subject: `New Lead: ${name} (${source || 'Website Contact'})`,
          html: htmlContent,
        });

        emailSuccess = true;
        console.log('Successfully sent lead email via SMTP.');
      } catch (emailErr) {
        console.error('Error sending SMTP email:', emailErr);
      }
    } else {
      console.log('SMTP credentials not fully set. Email sending skipped.');
    }

    return NextResponse.json({
      success: true,
      loggedToSheet: sheetSuccess,
      loggedToCRM: crmSuccess,
      emailed: emailSuccess,
    });
  } catch (error: unknown) {
    console.error('API Leads Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
