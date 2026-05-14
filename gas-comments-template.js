/**
 * Google Apps Script — Comments Web App
 * ─────────────────────────────────────────────────────────────────
 * วิธีติดตั้ง:
 *  1. เปิด Google Sheet ของคุณ → Extensions → Apps Script
 *  2. ลบโค้ดเดิม แล้ววางโค้ดนี้ทั้งหมด
 *  3. กด Save (Ctrl+S)
 *  4. Deploy → New Deployment
 *       - Type: Web app
 *       - Execute as: Me
 *       - Who has access: Anyone
 *  5. คัดลอก Web app URL ที่ได้
 *  6. ไปที่ Vercel → Settings → Environment Variables
 *     ใส่ Key:   NEXT_PUBLIC_GAS_COMMENTS_URL
 *     Value:    (URL ที่คัดลอกมา)
 *  7. Redeploy ใน Vercel
 * ─────────────────────────────────────────────────────────────────
 */

var SHEET_NAME = 'Sheet1'   // ← เปลี่ยนเป็นชื่อ tab ถ้าต่างกัน

function doPost(e) {
  try {
    var data    = JSON.parse(e.postData.contents)
    var name    = (data.name    || '').toString().trim()
    var message = (data.message || '').toString().trim()

    if (!name || !message) {
      return jsonResponse({ ok: false, error: 'name and message are required' })
    }

    var ss    = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0]

    // เพิ่มหัว column ถ้า sheet ยังว่าง
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Name', 'Message', 'Timestamp'])
    }

    var timestamp = Utilities.formatDate(
      new Date(), 'Asia/Bangkok', 'dd/MM/yyyy HH:mm:ss'
    )

    sheet.appendRow([name, message, timestamp])   // A=name  B=message  C=timestamp

    return jsonResponse({ ok: true })

  } catch (err) {
    return jsonResponse({ ok: false, error: err.message })
  }
}

function doGet() {
  return jsonResponse({ ok: true, status: 'Comments API is running' })
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}
