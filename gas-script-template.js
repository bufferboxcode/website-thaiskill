/**
 * ThaiSkill — Google Apps Script Web App
 * ========================================
 * วิธีติดตั้ง:
 * 1. เปิด Google Sheet ใหม่ (หรือใช้ Sheet ที่มีอยู่)
 * 2. ไปที่ Extensions → Apps Script
 * 3. วางโค้ดนี้ทั้งหมดแทนที่โค้ดเดิม แล้วกด Save
 * 4. กด Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. กด Deploy → คัดลอก Web app URL
 * 6. นำ URL ไปใส่ใน Vercel Environment Variables ชื่อ GAS_URL
 *    (Settings → Environment Variables → Add: GAS_URL = <URL ที่ได้>)
 * 7. Redeploy Vercel หรือรอ deploy ใหม่อัตโนมัติ
 *
 * Sheet ที่จะสร้างอัตโนมัติ:
 *   "ContactMessages" — รับ Name, PEA Email, Message จากฟอร์ม Get in Touch
 *   "Comments"        — รับ Name, Message จากฟอร์ม Comments (แสดงบนเว็บด้วย)
 */

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);
    const now = new Date();

    if (data.type === 'contact') {
      let sheet = ss.getSheetByName('ContactMessages');
      if (!sheet) {
        sheet = ss.insertSheet('ContactMessages');
        sheet.appendRow(['Timestamp', 'Name', 'PEA Email', 'Message']);
        sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      }
      sheet.appendRow([now, data.name, data.email, data.message]);

    } else if (data.type === 'comment') {
      let sheet = ss.getSheetByName('Comments');
      if (!sheet) {
        sheet = ss.insertSheet('Comments');
        sheet.appendRow(['Timestamp', 'Name', 'Message']);
        sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
      }
      sheet.appendRow([now, data.name, data.message]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const type = (e.parameter && e.parameter.type) || 'comments';
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (type === 'comments') {
      const sheet = ss.getSheetByName('Comments');
      if (!sheet || sheet.getLastRow() < 2) {
        return ContentService
          .createTextOutput(JSON.stringify([]))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues();
      const comments = rows
        .filter(row => row[1] && row[2])
        .map(row => ({
          timestamp: row[0] ? Utilities.formatDate(new Date(row[0]), 'Asia/Bangkok', 'dd MMM yyyy') : '',
          name: row[1],
          message: row[2],
        }))
        .reverse();

      return ContentService
        .createTextOutput(JSON.stringify(comments))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Unknown type' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
