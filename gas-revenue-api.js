/**
 * ThaiSkill Revenue API — Google Apps Script
 * =============================================
 * ใช้ Named Range แทนการอ้าง cell ตรงๆ
 * → ไม่ได้รับผลจาก: เพิ่ม row / column / tab / สูตร ใดๆ
 *
 * ════════════════════════════════════════════
 *  ขั้นตอนติดตั้ง (ทำครั้งเดียว)
 * ════════════════════════════════════════════
 * STEP 1 — สร้าง Named Range ใน Google Sheet
 *   1. คลิกที่ cell ที่เก็บตัวเลขรายได้สะสม
 *   2. เมนู Data → Named ranges
 *   3. กด "+ Add a range"
 *   4. ตั้งชื่อ:  revenue_current
 *   5. กด Done
 *   ✅ Named Range จะไม่ขยับแม้จะเพิ่ม row/column/sheet
 *
 * STEP 2 — ติดตั้ง Script นี้
 *   1. Extensions → Apps Script
 *   2. วางโค้ดนี้ทั้งหมด (ลบโค้ดเดิมก่อน)
 *   3. กด Save (Ctrl+S)
 *   4. Deploy → New deployment
 *        Type          : Web app
 *        Execute as    : Me
 *        Who has access: Anyone
 *   5. คัดลอก Web app URL
 *
 * STEP 3 — ใส่ URL ใน Vercel
 *   Vercel → Settings → Environment Variables → เพิ่ม:
 *     Key   : NEXT_PUBLIC_GAS_REVENUE_URL
 *     Value : (URL จาก STEP 2)
 *   แล้ว Redeploy
 *
 * ════════════════════════════════════════════
 *  Response format
 * ════════════════════════════════════════════
 *   { "ok": true,  "revenue": 6151200, "source": "named_range" }
 *   { "ok": true,  "revenue": 6151200, "source": "key_value"   }  ← fallback
 *   { "ok": false, "error": "...",     "revenue": 0            }  ← error
 */

var NAMED_RANGE = 'revenue_current'  // ← ชื่อ Named Range ที่ตั้งใน STEP 1

// ──────────────────────────────────────────────────────────
// GET — เว็บไซต์จะเรียก endpoint นี้ทุก 5 นาที
// ──────────────────────────────────────────────────────────
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet()

    // ─── วิธีที่ 1: Named Range (แนะนำ) ───────────────────
    // ไม่ขยับแม้จะเพิ่ม row / column / sheet / formula ใดๆ
    var namedRange = ss.getRangeByName(NAMED_RANGE)
    if (namedRange) {
      var rawValue = namedRange.getValue()
      var num = cleanNumber(rawValue)
      if (num > 0) {
        return jsonOk(num, 'named_range')
      }
    }

    // ─── วิธีที่ 2: Key-Value fallback ────────────────────
    // ค้นหา row ที่ column A = "revenue_current" ในทุก sheet
    // ใช้เมื่อยังไม่ได้สร้าง Named Range
    var sheets = ss.getSheets()
    for (var i = 0; i < sheets.length; i++) {
      var sheet = sheets[i]
      var lastRow = sheet.getLastRow()
      if (lastRow < 1) continue

      var lastCol = Math.min(sheet.getLastColumn(), 10) // อ่านสูงสุด 10 col
      if (lastCol < 2) continue

      var data = sheet.getRange(1, 1, lastRow, 2).getValues()
      for (var r = 0; r < data.length; r++) {
        var key = String(data[r][0]).trim().toLowerCase()
        if (key === 'revenue_current') {
          var val = cleanNumber(data[r][1])
          if (val > 0) {
            return jsonOk(val, 'key_value')
          }
        }
      }
    }

    return jsonError('revenue_current not found — please create Named Range or add key-value row')

  } catch (err) {
    return jsonError(String(err))
  }
}

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────

/** แปลงค่าใดๆ (ตัวเลข, string มี ฿ หรือ comma) → number */
function cleanNumber(raw) {
  if (typeof raw === 'number') return raw > 0 ? raw : 0
  var cleaned = String(raw).replace(/[฿$€£\s,]/g, '')
  var n = parseFloat(cleaned)
  return isNaN(n) ? 0 : n
}

function jsonOk(revenue, source) {
  return json({ ok: true, revenue: revenue, source: source })
}

function jsonError(msg) {
  return json({ ok: false, error: msg, revenue: 0 })
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}
