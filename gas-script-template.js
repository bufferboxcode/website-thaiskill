/**
 * ThaiSkill — Google Apps Script Web App
 * ========================================
 * ใช้กับ Google Sheet นี้:
 * https://docs.google.com/spreadsheets/d/e/2PACX-1vT7_pREWe1r1Lrou4aNsrqk0V7M1NbdZX2OTj54DPfgIBBEG1UlrAEnzu28yq-KsGAuL2Vp1HOmztVu/pub?output=csv
 *
 * วิธีติดตั้ง:
 * 1. เปิด Google Sheet ข้างต้น (ต้องเป็นเจ้าของหรือมีสิทธิ์แก้ไข)
 * 2. ไปที่ Extensions → Apps Script
 * 3. วางโค้ดนี้ทั้งหมด → กด Save (Ctrl+S)
 * 4. กด Deploy → New deployment
 *      - Type         : Web app
 *      - Execute as   : Me
 *      - Who has access: Anyone
 * 5. กด Deploy → คัดลอก Web app URL ที่ได้
 * 6. ไปที่ Vercel → Settings → Environment Variables → เพิ่ม:
 *      Name : GAS_URL
 *      Value: <URL ที่ได้จากข้อ 5>
 * 7. Redeploy Vercel (หรือรอ deploy อัตโนมัติ)
 *
 * Sheet structure (สร้างอัตโนมัติ):
 *   Sheet1 (tab แรก)   → Comments     : Timestamp | Name | Message
 *   "ContactMessages"  → Contact form : Timestamp | Name | PEA Email | Message
 *
 * หมายเหตุ: ระบบอ่าน Comments จาก CSV URL ของ Sheet1 (tab แรก) โดยอัตโนมัติ
 */

function doPost(e) {
  try {
    const ss   = SpreadsheetApp.getActiveSpreadsheet()
    const data = JSON.parse(e.postData.contents)
    const now  = new Date()

    if (data.type === 'comment') {
      // เขียนลง Sheet แรก (tab แรก) — ตรงกับ CSV URL ที่ระบบอ่าน
      const sheet = ss.getSheets()[0]
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Timestamp', 'Name', 'Message'])
        sheet.getRange(1, 1, 1, 3).setFontWeight('bold')
      }
      sheet.appendRow([now, data.name, data.message])

    } else if (data.type === 'contact') {
      // เขียนลง tab "ContactMessages" (สร้างใหม่ถ้ายังไม่มี)
      let sheet = ss.getSheetByName('ContactMessages')
      if (!sheet) {
        sheet = ss.insertSheet('ContactMessages')
        sheet.appendRow(['Timestamp', 'Name', 'PEA Email', 'Message'])
        sheet.getRange(1, 1, 1, 4).setFontWeight('bold')
      }
      sheet.appendRow([now, data.name, data.email, data.message])
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

function doGet(e) {
  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheets()[0]   // Sheet แรก = Comments

    if (!sheet || sheet.getLastRow() < 2) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON)
    }

    const rows     = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues()
    const comments = rows
      .filter(row => row[1] && row[2])
      .map(row => ({
        timestamp: row[0]
          ? Utilities.formatDate(new Date(row[0]), 'Asia/Bangkok', 'dd MMM yyyy')
          : '',
        name   : String(row[1]),
        message: String(row[2]),
      }))
      .reverse()

    return ContentService
      .createTextOutput(JSON.stringify(comments))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}
