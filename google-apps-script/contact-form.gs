/**
 * Google Apps Script — Contact Form Handler
 *
 * SETUP:
 * 1. Go to https://script.google.com and create a new project
 * 2. Paste this entire file into the editor
 * 3. Click Deploy → New deployment
 * 4. Choose "Web app" as the type
 * 5. Set "Execute as" → Me
 * 6. Set "Who has access" → Anyone
 * 7. Click Deploy and copy the URL
 * 8. Paste the URL into FORM_ENDPOINT in DubaiLandingPage.tsx
 *
 * The script creates a Google Sheet called "Dole's Music — Leads"
 * in your Drive on first submission and appends each lead as a new row.
 */

const SHEET_NAME = "Dole's Music — Leads";

function getOrCreateSheet() {
  const files = DriveApp.getFilesByName(SHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next()).getActiveSheet();
  }
  const ss = SpreadsheetApp.create(SHEET_NAME);
  const sheet = ss.getActiveSheet();
  sheet.appendRow(['Timestamp', 'Name', 'Email', 'Instagram', 'WhatsApp', 'Description']);
  sheet.getRange('1:1').setFontWeight('bold');
  sheet.setColumnWidths(1, 6, 180);
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    sheet.appendRow([
      new Date().toISOString(),
      data.name || '',
      data.email || '',
      data.instagram || '',
      data.whatsapp || '',
      data.description || '',
    ]);

    // Send email notification
    const recipient = 'sastha@dolesmusic.com';
    const subject = 'New Lead — ' + (data.name || 'Unknown');
    const body = [
      'New contact form submission:',
      '',
      'Name: ' + (data.name || '—'),
      'Email: ' + (data.email || '—'),
      'Instagram: ' + (data.instagram || '—'),
      'WhatsApp: ' + (data.whatsapp || '—'),
      'Project: ' + (data.description || '—'),
      '',
      'Submitted: ' + new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    ].join('\n');

    MailApp.sendEmail(recipient, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Contact form endpoint is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
