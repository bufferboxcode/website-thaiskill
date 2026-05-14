/**
 * ThaiSkill — Google Apps Script Web App
 * ========================================
 * ติดตั้งบน Google Sheet ที่มี tab gid=2127867965:
 * https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6P9WqCiP8Nq5p_TBvXF2VmG9VpTzwj2Sx_CmPmjRZ12EFuTRbqP5yWz_Nk0H10P8EnmAjet9rwmNF/pub?gid=2127867965&single=true&output=csv
 *
 * วิธีติดตั้ง:
 * 1. เปิด Google Sheet นั้น (ต้องเป็นเจ้าของหรือมีสิทธิ์แก้ไข)
 * 2. Extensions → Apps Script
 * 3. วางโค้ดนี้ทั้งหมด → Ctrl+S (Save)
 * 4. Deploy → New deployment
 *      Type          : Web app
 *      Execute as    : Me
 *      Who has access: Anyone
 * 5. คัดลอก Web app URL
 * 6. Vercel → Settings → Environment Variables → เพิ่ม:
 *      GAS_URL = <URL จากข้อ 5>
 * 7. Redeploy Vercel
 *
 * Sheet ที่ script จะใช้:
 *   gid=2127867965  → รับข้อมูล Contact form  (Name, PEA Email, Message)
 *   "Comments" tab  → รับข้อมูล Comments      (Name, Message)
 */

var CONTACT_GID = 2127867965   // gid ของ tab รับ contact form

// ──────────────────────────────────────────────────────────
// POST: รับข้อมูลจากเว็บไซต์ → เขียนลง Sheet
// ──────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var ss   = SpreadsheetApp.getActiveSpreadsheet()
    var data = JSON.parse(e.postData.contents)
    var now  = new Date()

    if (data.type === 'contact') {
      var sheet = getSheetByGid(ss, CONTACT_GID)
      ensureContactHeader(sheet)
      sheet.appendRow([now, data.name, data.email, data.message])

    } else if (data.type === 'comment') {
      var cSheet = ss.getSheetByName('Comments')
      if (!cSheet) {
        cSheet = ss.insertSheet('Comments')
        cSheet.appendRow(['Timestamp', 'Name', 'Message'])
        cSheet.getRange(1, 1, 1, 3).setFontWeight('bold')
      }
      cSheet.appendRow([now, data.name, data.message])
    }

    return ok()
  } catch (err) {
    return fail(err)
  }
}

// ──────────────────────────────────────────────────────────
// GET: ส่ง Comments กลับเป็น JSON (ใช้โดย /api/comments)
// ──────────────────────────────────────────────────────────
function doGet(e) {
  try {
    var ss    = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = ss.getSheetByName('Comments')

    if (!sheet || sheet.getLastRow() < 2) {
      return json([])
    }

    var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getValues()
    var comments = rows
      .filter(function(r) { return r[1] && r[2] })
      .map(function(r) {
        return {
          timestamp: r[0] ? Utilities.formatDate(new Date(r[0]), 'Asia/Bangkok', 'dd MMM yyyy') : '',
          name     : String(r[1]),
          message  : String(r[2]),
        }
      })
      .reverse()

    return json(comments)
  } catch (err) {
    return fail(err)
  }
}

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────

/** หา Sheet ด้วย gid; ถ้าไม่เจอให้สร้าง tab ใหม่ */
function getSheetByGid(ss, gid) {
  var sheets = ss.getSheets()
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getSheetId() === gid) return sheets[i]
  }
  // ไม่เจอ gid → สร้าง tab ใหม่ชื่อ ContactMessages
  var newSheet = ss.insertSheet('ContactMessages')
  newSheet.getRange(1, 1, 1, 4).setFontWeight('bold')
  return newSheet
}

/** ตรวจและเพิ่ม header ถ้า sheet ยังว่างอยู่ */
function ensureContactHeader(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'PEA Email', 'Message'])
    sheet.getRange(1, 1, 1, 4).setFontWeight('bold')
  }
}

function ok()       { return json({ success: true }) }
function fail(err)  { return json({ success: false, error: String(err) }) }
function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}
